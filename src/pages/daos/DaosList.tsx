import { styled, Typography } from "@mui/material";
import { Container, List, LoadMore, Search } from "components";
import { useDaosQuery } from "query/queries";
import { useAppNavigation } from "router";
import { StyledFlexColumn, StyledFlexRow, StyledSkeletonLoader } from "styles";
import { useIntersectionObserver } from "react-intersection-observer-hook";

import {
  StyledDao,
  StyledDaoAvatar,
  StyledDaoContent,
  StyledDaosList,
  StyledJoinDao,
} from "./styles";
import { makeElipsisAddress } from "utils";
import { Dao } from "types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import _ from "lodash";
import { StringParam, useQueryParam } from "use-query-params";
import { OLD_DAO } from "data";
import { DAOS_LIMIT, useDaosListLimit } from "./store";


const filterDaos = (daos: Dao[], searchValue: string) => {
  if (!searchValue) return daos;
  const nameFilter = _.filter(daos, (it) =>
    it.daoMetadata.name.toLowerCase().includes(searchValue.toLowerCase())
  );
  const addressFilter = _.filter(daos, (it) =>
    it.daoAddress.toLowerCase().includes(searchValue.toLowerCase())
  );
  return _.uniqBy([...nameFilter, ...addressFilter], "daoAddress");
};

export function DaosList() {
  const { data = [], isLoading } = useDaosQuery();
 const {limit, loadMore} = useDaosListLimit();
  const [searchValue, setSearchValue] = useState("");

  const [queryParam, setQueryParam] = useQueryParam("q", StringParam);



  const onSearchInputChange = (value: string) => {
    setSearchValue(value);
    setQueryParam(value  ||  undefined,'pushIn' );
  };

  const filteredDaos = filterDaos(data, searchValue);

  

  const emptyList = !isLoading && !_.size(data);
  return (
    <StyledFlexColumn alignItems="flex-start" gap={24}>
      <StyledFlexRow justifyContent="space-between">
        <StyledSearch
          initialValue={queryParam as string}
          onChange={onSearchInputChange}
        />
        <StyledDaosAmount>
          <Typography>{_.size(data) + 1} Daos</Typography>
        </StyledDaosAmount>
      </StyledFlexRow>
      <StyledFlexColumn gap={25}>
        <List
          isLoading={isLoading}
          isEmpty={!!emptyList}
          loader={<ListLoader />}
          emptyComponent={
            <StyledEmptyList>There are no Daos yet</StyledEmptyList>
          }
        >
          <StyledDaosList>
            <DaoListItem dao={OLD_DAO} />
            {filteredDaos.map((dao, index) => {
              if (index > limit) return null;
              return <DaoListItem key={dao.daoAddress} dao={dao} />;
            })}
          </StyledDaosList>
        </List>

        <LoadMore
          totalItems={_.size(filteredDaos)}
          amountToShow={limit}
          showMore={loadMore}
          limit={DAOS_LIMIT}
        />
      </StyledFlexColumn>
    </StyledFlexColumn>
  );
}

const StyledDaosAmount = styled(Container)({
  padding: "10px 20px",
  borderRadius: 20,
  width: "unset",
  p: {
    fontSize: 13,
  },
});

const StyledEmptyList = styled(Typography)({
  fontSize: 18,
  fontWeight: 700,
});

const StyledSearch = styled(Search)({
  maxWidth: 400,
  width: "100%",
});

const ListLoader = () => {
  return (
    <StyledDaosList>
      {_.range(0, 1).map((it, i) => {
        return (
          <StyledDao key={i}>
            <StyledDaoContent>
              <StyledFlexColumn>
                <StyledSkeletonLoader style={{borderRadius: '50%', width: 70, height: 70}} />
                <StyledSkeletonLoader style={{width:'70%'}} />
                <StyledSkeletonLoader />
              </StyledFlexColumn>
            </StyledDaoContent>
          </StyledDao>
        );
      })}
    </StyledDaosList>
  );
};

const useJoinDao = () => {
  return useMutation(async () => {});
};

export const DaoListItem = ({ dao }: { dao: Dao }) => {
  const [ref, { entry }] = useIntersectionObserver();
  const isVisible = entry && entry.isIntersecting;
  const { daoPage } = useAppNavigation();
  const { mutate } = useJoinDao();
  const { daoMetadata } = dao;

  const join = (e: any) => {
    e.stopPropagation();
    mutate();
  };

  return (
    <StyledDao ref={ref} onClick={() => daoPage.root(dao.daoAddress)}>
      <StyledDaoContent className="container" hover>
        {isVisible ? (
          <StyledFlexColumn>
            <StyledDaoAvatar src={daoMetadata?.avatar} />
            <Typography className="title">{daoMetadata?.name}</Typography>
            <Typography className="address">
              {makeElipsisAddress(dao.daoAddress, 6)}
            </Typography>
            {/* <StyledJoinDao onClick={join}>Join</StyledJoinDao> */}
          </StyledFlexColumn>
        ) : null}
      </StyledDaoContent>
    </StyledDao>
  );
};