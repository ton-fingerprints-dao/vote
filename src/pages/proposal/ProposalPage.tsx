import { Fade, styled, useMediaQuery } from "@mui/material";
import { Page } from "components";
import { StyledFlexColumn, StyledFlexRow } from "styles";
import { Deadline } from "./Deadline";
import { Hero } from "./Hero";
import { Metadata } from "./Metadata";
import { Results } from "./Results";
import { Vote } from "./Vote";
import { Votes } from "./Votes";
import { Helmet } from "react-helmet";
import { APP_TITLE } from "config";
import { appNavigation } from "router";
import { useDaoAddress } from "hooks";

const Destop = () => {
  return (
    <StyledWrapper>
      <StyledLeft>
        <Hero />
        <Vote />
        <Votes />
      </StyledLeft>
      <StyledRight>
        <Deadline />
        <Metadata />
        <Results />
      </StyledRight>
    </StyledWrapper>
  );
};

const Mobile = () => {
  return (
    <StyledWrapper>
      <Deadline />
      <Hero />
      <Vote />
      <Results />
      <Metadata />
      <Votes />
    </StyledWrapper>
  );
};

const Meta = () => {
  return (
    <Helmet>
      <title>
        {APP_TITLE}
        {/* {data ? `- ${data.title}` : ""} */}
      </title>
    </Helmet>
  );
};

function ProposalPage() {
  const mobile = useMediaQuery("(max-width:800px)");
  const daoAddress = useDaoAddress();

  return (
    <Page
      back={appNavigation.daoPage.root(daoAddress)}
    >
      <Meta />
      {mobile ? <Mobile /> : <Destop />}
    </Page>
  );
}

export { ProposalPage };

const StyledWrapper = styled(StyledFlexRow)({
  alignItems: "flex-start",
  "@media (max-width: 850px)": {
    flexDirection: "column",
  },
});

const StyledLeft = styled(StyledFlexColumn)({
  width: "calc(100% - 370px - 10px)",
});

const StyledRight = styled(StyledFlexColumn)({
  width: 370,
  position: "sticky",
  top: 90,
});