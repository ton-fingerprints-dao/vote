import { Typography, useTheme } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { AppTooltip, Container, OverflowWithTooltip, VerifiedDao } from "components";
import { useConnection } from "ConnectionProvider";
import { useIsOwner } from "hooks";
import { useCommonTranslations } from "i18n/hooks/useCommonTranslations";
import { AiFillEyeInvisible } from "react-icons/ai";
import { useIntersectionObserver } from "react-intersection-observer-hook";
import TextOverflow from "react-text-overflow";
import { useAppNavigation } from "router/navigation";
import { StyledFlexColumn, StyledFlexRow } from "styles";
import { Dao } from "types";
import { isOwner, makeElipsisAddress, nFormatter, parseLanguage } from "utils";
import {
  StyledDao,
  StyledDaoAvatar,
  StyledDaoContent,
  StyledHiddenIcon,
} from "./styles";

export const DaoListItem = ({ dao }: { dao: Dao }) => {
  const [ref, { entry }] = useIntersectionObserver();
  const isVisible = entry && entry.isIntersecting;
  const { daoPage } = useAppNavigation();
  const { daoMetadata } = dao;
  const walletAddress = useConnection().address;
  const theme = useTheme();
  const t = useCommonTranslations();
  const { isDaoOwner, isProposalOnwer } = useIsOwner(dao.daoAddress);

  const isOwner = isDaoOwner || isProposalOnwer;

  if (dao.daoMetadata.hide && !isOwner) return null;

  return (
    <StyledDao
      ref={ref}
      onClick={() => daoPage.root(dao.daoAddress)}
    
    >
      <StyledDaoContent className="container" hover>
        {dao.daoMetadata.hide && (
          <AppTooltip text="Dao is hidden, you can change it in the settings page">
            <StyledHiddenIcon>
              <AiFillEyeInvisible
                style={{ width: 25, height: 25 }}
                color={theme.palette.primary.main}
              />
            </StyledHiddenIcon>
          </AppTooltip>
        )}
        {isVisible ? (
          <StyledFlexColumn>
            <StyledDaoAvatar src={daoMetadata?.avatar} />
            <Typography className="title">
              <TextOverflow text={parseLanguage(daoMetadata?.name) || ""} />
            </Typography>
            <Address dao={dao} />
            <Container className="members">
              <Typography>
                {nFormatter(100000)} {t.members}
              </Typography>
            </Container>
          </StyledFlexColumn>
        ) : null}
      </StyledDaoContent>
    </StyledDao>
  );
};

const useJoinDao = () => {
  return useMutation(async () => {});
};

const Address = ({ dao }: { dao: Dao }) => {
  return (
    <StyledFlexRow className="address">
      {dao.daoMetadata.dns ? (
        <OverflowWithTooltip
          className="address-value"
          text={dao.daoMetadata.dns}
        />
      ) : (
        <Typography className="address-value">
          {makeElipsisAddress(dao.daoAddress, 6)}
        </Typography>
      )}
      <VerifiedDao daoAddress={dao.daoAddress} />
    </StyledFlexRow>
  );
};
