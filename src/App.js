import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Transition } from "react-transition-group";
import {
  TextField,
  DisplayText,
  Icon,
  Form,
  FormLayout,
} from "@shopify/polaris";
import { SearchMinor } from "@shopify/polaris-icons";

import styled from "styled-components";

const ApplicationWrapper = styled.div`
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #f4f6f8;
  margin: 40px 0;
`;
ApplicationWrapper.displayName = "ApplicationWrapper";

const PageWrapperDiv = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(200px, 800px));
  margin-top: 50px;
`;
PageWrapperDiv.displayName = "PageWrapperDiv";

const NominationsTitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
NominationsTitleWrapper.displayName = "NominationsTitleWrapper";

const Styledli = styled.li`
  transition: opacity 500ms ease-in;
  opacity: ${({ state }) => (state === "entered" ? 0 : 1)};
  opacity: ${({ state }) => (state === "exited" ? 1 : 0)};
`;
Styledli.displayName = "Styledli";

const NominationsWrapper = styled.div`
  display: flex;
  gap: 40px;
`;
NominationsWrapper.displayName = "NominationsWrapper";

const ResultsWrapper = styled.div`
  width: 100%;
  min-height: 500px;
  background: #ffffff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  padding: 20px;
`;
ResultsWrapper.displayName = "ResultsWrapper";

const StyledUList = styled.ul`
  list-style-type: none;
  padding: 0;
  display: grid;
  gap: 10px;
`;
StyledUList.displayName = "StyledUList";

function App() {
  const [query, setQuery] = useState("");
  const [searchedQuery, setSearchedQuery] = useState("");
  const [data, setData] = useState([]);
  const [nominations, setNominations] = useState(
    JSON.parse(localStorage.getItem("data")) || []
  );
  const [url, setUrl] = useState("");
  const [apiKey] = useState(process.env.REACT_APP_SHOPIFY_OMDB_API_KEY);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(url);
      setData(result.data.Search);
    };

    fetchData();
  }, [url]);

  const handleSearchFieldChange = useCallback((value, event) => {
    setQuery(value);
  }, []);

  const doAnimate = useCallback(() => {
    setAnimate(true);
    setTimeout(() => {
      setAnimate(false);
    }, 500);
  }, []);

  return (
    <ApplicationWrapper>
      <PageWrapperDiv>
        <DisplayText size="extraLarge"> The Shoppies</DisplayText>
        <Form
          onSubmit={() => {
            setUrl(`https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`);
            setSearchedQuery(query);
            doAnimate();
          }}
          implicitSubmit
        >
          <FormLayout>
            <TextField
              prefix={<Icon source={SearchMinor} color="inkLighter" />}
              value={query}
              label="Movie title"
              placeholder="Search Movies..."
              onChange={handleSearchFieldChange}
            />
          </FormLayout>
        </Form>
        <NominationsWrapper>
          <ResultsWrapper>
            <DisplayText size="small">{`Results for "${searchedQuery}"`}</DisplayText>
            <StyledUList>
              {
                <Transition in={animate}>
                  {(state) =>
                    data &&
                    data.map((item) => {
                      return (
                        <Styledli
                          state={state}
                          id={`${item.Type}_${item.imdbID}`}
                          key={`result_${item.imdbID}`}
                        >
                          <span>
                            {item.Title} ({item.Year})&nbsp;
                          </span>
                          <button
                            onClick={() => {
                              let newData = [...nominations, item];
                              setNominations(newData);
                              localStorage.setItem(
                                "data",
                                JSON.stringify(newData)
                              );
                            }}
                            disabled={
                              nominations &&
                              nominations.find(
                                (val) => val["imdbID"] === item.imdbID
                              )
                            }
                          >
                            Nominate
                          </button>
                        </Styledli>
                      );
                    })
                  }
                </Transition>
              }
            </StyledUList>
          </ResultsWrapper>
          <ResultsWrapper>
            <NominationsTitleWrapper>
              <DisplayText size="small">Nominations</DisplayText>
              {nominations.length >= 5 && (
                <span>{`There are ${nominations.length} nominations!`}</span>
              )}
            </NominationsTitleWrapper>
            <StyledUList>
              {nominations &&
                nominations.map((item) => {
                  return (
                    <li
                      id={`${item.type}_${item.imdbID}`}
                      key={`result_${item.imdbID}`}
                    >
                      <span>
                        {item.Title} ({item.Year})&nbsp;
                      </span>
                      <button
                        onClick={() => {
                          let newData = nominations.filter(
                            (val) => val !== item
                          );
                          setNominations(newData);
                          localStorage.setItem("data", JSON.stringify(newData));
                        }}
                      >
                        Remove
                      </button>
                    </li>
                  );
                })}
            </StyledUList>
          </ResultsWrapper>
        </NominationsWrapper>
      </PageWrapperDiv>
    </ApplicationWrapper>
  );
}

export default App;
