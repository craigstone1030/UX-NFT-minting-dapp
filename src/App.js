import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";

import * as s from "./styles/globalStyles";
import styled from "styled-components";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

  export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: var(--secondary);
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--secondary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [presaleStartDate, setPresaleStartDate] = useState(1651875410);
	const [publicStartDate, setPublicStartDate] = useState(1652221010);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click mint to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,    
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {

    let cost = data.price;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);

    const now = parseInt((new Date()).getTime() / 1000);
    if ( now < presaleStartDate ) {
      setFeedback(
        `Sorry, Presale Minting is not started.`
      );
      setClaimingNft(false);
    }
    // } else if (presaleStartDate <= now && now < publicStartDate) {      
    //   blockchain.smartContract.methods
    //   .preSaleMint(mintAmount)
    //   .send({
    //     gasLimit: String(totalGasLimit),
    //     to: CONFIG.CONTRACT_ADDRESS,
    //     from: blockchain.account,
    //     value: totalCostWei,
    //   })
    //   .once("error", (err) => {
    //     console.log(err);
    //     setFeedback("Sorry, something went wrong please try again later.");
    //     setClaimingNft(false);
    //   })
    //   .then((receipt) => {
    //     console.log(receipt);
    //     setFeedback(
    //       `WOW, the ${CONFIG.NFT_NAME} is yours!`
    //     );
    //     setClaimingNft(false);
    //     dispatch(fetchData(blockchain.account));
    //   });
    // } 
    else {
      blockchain.smartContract.methods
        .mint(mintAmount)
        .send({
          gasLimit: String(totalGasLimit),
          to: CONFIG.CONTRACT_ADDRESS,
          from: blockchain.account,
          value: totalCostWei,
        })
        .once("error", (err) => {
          console.log(err);
          setFeedback("Sorry, something went wrong please try again later.");
          setClaimingNft(false);
        })
        .then((receipt) => {
          console.log(receipt);
          setFeedback(
            `WOW, the ${CONFIG.NFT_NAME} is yours!`
          );
          setClaimingNft(false);
          dispatch(fetchData(blockchain.account));
        });
    }
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 5) {
      newMintAmount = 5;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    dispatch(connect())
    getConfig();
    getData();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <div className="body">
      <div id="header" className="section wf-section">
        <div className="w-row">
          <div className="w-col w-col-6">
            <h1 className="heading">UX</h1>
          </div>
        </div>
      </div>
      <div className="text-block">a tribute to Doodles &amp; Prime Ape Planet</div>
      <div className="w-row">
        <div className="w-col w-col-6">
            <div className="w-layout-grid">
              <img src="https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg" loading="lazy" id="w-node-bafb5c9a-c5db-8938-7317-e71c9a01f204-a144ce4e" alt="" />
              <img src="images/1.png" loading="lazy" sizes="(max-width: 479px) 96vw, (max-width: 767px) 97vw, (max-width: 991px) 48vw, (max-width: 5104px) 49vw, 2501px" srcSet="images/1.png, images/1.png 800w, images/1.png, images/1.png, images/1.png, images/1.png" alt="" />
              <img src="images/2.png" loading="lazy" id="w-node-_042d0546-c04e-e625-0c54-60fb20df4cc1-a144ce4e" sizes="(max-width: 479px) 96vw, (max-width: 767px) 97vw, (max-width: 991px) 48vw, (max-width: 5102px) 49vw, 2500px" srcSet="images/2.png, images/2.png, images/2.png, images/2.png, images/2.png, images/2.png" alt="" />
              <img src="images/3.png" loading="lazy" id="w-node-_90a7731f-c361-3259-9106-eab79cf527b1-a144ce4e" sizes="(max-width: 479px) 96vw, (max-width: 767px) 97vw, (max-width: 991px) 48vw, (max-width: 5104px) 49vw, 2501px" srcSet="images/3.png, images/3.png, images/3.png, images/3.png, images/3.png" alt="" />
              <img src="https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg" loading="lazy" id="w-node-_2c97b677-293c-41e4-a155-4cec061470d5-a144ce4e" alt="" />
              <img src="images/4.png" loading="lazy" id="w-node-_197fe249-8876-f240-b66e-1578ac0d4a0f-a144ce4e" sizes="(max-width: 479px) 96vw, (max-width: 767px) 97vw, (max-width: 991px) 48vw, (max-width: 5102px) 49vw, 2500px" srcSet="images/4.png, images/4.png, images/4.png, images/4.png, images/4.png, images/4.png" alt="" />
            </div>
        </div>
        <div className="w-col w-col-6">
          <h1 className="heading-2">Welcome to the UX metaverse!</h1>
          <div className="container w-container"></div>
          <div className="w-container">
            <s.Container
              flex={2}
              jc={"center"}
              ai={"center"}
              style={{
                backgroundColor: "var(--accent)",
                padding: 24,
                borderRadius: 24,
                border: "4px dashed var(--secondary)",
                boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
              }}
            >
              {/* <s.TextTitle
                style={{
                  textAlign: "center",
                  fontSize: 50,
                  fontWeight: "bold",
                  color: "var(--accent-text)",
                }}
              >
                {data.totalSupply} / {CONFIG.MAX_SUPPLY}
              </s.TextTitle> */}
              <s.TextDescription
                style={{
                  textAlign: "center",
                  color: "var(--primary-text)",
                }}
              >
                <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
                  {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
                </StyledLink>
              </s.TextDescription>
              <s.SpacerSmall />
              {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
                <>
                  <s.TextTitle
                    style={{ textAlign: "center", color: "var(--accent-text)" }}
                  >
                    The sale has ended.
                  </s.TextTitle>
                  <s.TextDescription
                    style={{ textAlign: "center", color: "var(--accent-text)" }}
                  >
                    You can still find {CONFIG.NFT_NAME} on
                  </s.TextDescription>
                  <s.SpacerSmall />
                  <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                    {CONFIG.MARKETPLACE}
                  </StyledLink>
                </>
              ) : (
                <>
                  <s.TextTitle
                    style={{ textAlign: "center", color: "var(--accent-text)" }}
                  >
                    1 {CONFIG.SYMBOL} costs {  data.price  / Math.pow(10, 18) }{" "}
                    {CONFIG.NETWORK.SYMBOL}.
                  </s.TextTitle>
                  <s.SpacerXSmall />
                  <s.TextDescription
                    style={{ textAlign: "center", color: "var(--accent-text)" }}
                  >
                    Excluding gas fees.
                  </s.TextDescription>
                  <s.SpacerSmall />
                  {blockchain.account === "" ||
                  blockchain.smartContract === null ? (
                    <s.Container ai={"center"} jc={"center"}>
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        Connect to the {CONFIG.NETWORK.NAME} network
                      </s.TextDescription>
                      <s.SpacerSmall />
                      <StyledButton
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch(connect());
                          getData();
                        }}
                      >
                        CONNECT
                      </StyledButton>
                      {blockchain.errorMsg !== "" ? (
                        <>
                          <s.SpacerSmall />
                          <s.TextDescription
                            style={{
                              textAlign: "center",
                              color: "var(--accent-text)",
                            }}
                          >
                            {blockchain.errorMsg}
                          </s.TextDescription>
                        </>
                      ) : null}
                    </s.Container>
                  ) : (
                    <>
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        {feedback}
                      </s.TextDescription>
                      <s.SpacerMedium />
                      <s.Container ai={"center"} jc={"center"} fd={"row"}>
                        <StyledRoundButton
                          style={{ lineHeight: 0.4 }}
                          disabled={claimingNft ? 1 : 0}
                          onClick={(e) => {
                            e.preventDefault();
                            decrementMintAmount();
                          }}
                        >
                          -
                        </StyledRoundButton>
                        <s.SpacerMedium />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {mintAmount}
                        </s.TextDescription>
                        <s.SpacerMedium />
                        <StyledRoundButton
                          disabled={claimingNft ? 1 : 0}
                          onClick={(e) => {
                            e.preventDefault();
                            incrementMintAmount();
                          }}
                        >
                          +
                        </StyledRoundButton>
                      </s.Container>
                      <s.SpacerSmall />
                      <s.Container ai={"center"} jc={"center"} fd={"row"}>
                        <StyledButton
                          disabled={claimingNft ? 1 : 0}
                          onClick={(e) => {
                            e.preventDefault();
                            claimNFTs();
                            getData();
                          }}
                        >
                          {claimingNft ? "MINTING" : "MINT"}
                        </StyledButton>
                      </s.Container>
                    </>
                  )}
                </>
              )}
              <s.SpacerMedium />
            </s.Container>

          </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
          <p className="paragraph"><strong><br /><br />Doodle Prime Apes are cure creatures living on ethereum blockchain.<br />‍</strong><br /><strong>The collection consists of 10.001 randomly generated DPAs.<br />‍</strong><br /><strong>Our main idea is to create a community, which consists of</strong><br /><strong>NFT enthusiasts, investors and people who love NFTs.<br /><br /><br />There is no presale. Our first 1000 minters will able to mint 0.2 ETH<br /><br />Public sale mint price: 0.25 ETH</strong></p>
          <div className="w-layout-grid grid-3">
            <a id="w-node-_51f79f52-f6d4-db81-e1e5-6407bb33bc9c-a144ce4e" href="https://discord.com/invite/6A2WxKJ9" className="w-inline-block">
              <img src="images/discord.png" loading="lazy" width="80" sizes="80px" srcSet="images/discord-p-500.png 500w, images/discord.png 512w" alt="" />
            </a>
            <a id="w-node-_343ab69e-b1b2-14df-3d03-b346aab79767-a144ce4e" href="https://twitter.com/doodleprimeapes" target="_blank" className="w-inline-block">
              <img src="images/twitter-1.png" loading="lazy" width="80" sizes="80px" srcSet="images/twitter-1-p-500.png 500w, images/twitter-1.png 512w" alt="" className="image-3" />
            </a>
          </div>
        </div>
      </div>
      <div className="section-3 wf-section">
        <div className="w-container">
          <h1 className="heading-3">ROADMAP 1.0</h1>
        </div>
      </div>
      <div className="footer-thin-wrapper footer-thin copyright wf-section">
        <div className="footer-thin-container">
          <div className="copyright-text">Copyright 2022. All Rights Reserved. <br />not affiliated with Doodles &amp; Prime Ape Planet.</div>
        </div>
      </div>
    </div>
  );
}

export default App;
