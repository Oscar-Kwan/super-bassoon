import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { TextField, DisplayText, Icon } from "@shopify/polaris";
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
  margin-top: 50px;
`;
ApplicationWrapper.displayName = "ApplicationWrapper";

const PageWrapperDiv = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(200px, 800px));
`;
PageWrapperDiv.displayName = "PageWrapperDiv";

const NominationsWrapper = styled.div`
  display: flex;
  gap: 10px;
`;

const ResultsWrapper = styled.div`
  width: 100%;
  height: 500px;
  background: #ffffff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  padding: 20px;
`;

const StyledUList = styled.ul`
  list-style-type: none;
  padding: 0;
  display: grid;
  gap: 10px;
`;

function App() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [nominations, setNominations] = useState([]);
  const [url, setUrl] = useState("");
  const [apiKey] = useState(process.env.REACT_APP_SHOPIFY_OMDB_API_KEY);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(url);
      setData(result.data);
    };

    fetchData();
  }, [url]);

  const handleSearchFieldChange = useCallback((value, event) => {
    setQuery(value);
    console.log(event);
  }, []);

  return (
    <ApplicationWrapper>
      <PageWrapperDiv>
        <DisplayText size="extraLarge"> The Shoppies</DisplayText>
        <TextField
          prefix={<Icon source={SearchMinor} color="inkLighter" />}
          value={query}
          onChange={handleSearchFieldChange}
        />
        <button
          onClick={() => {
            setUrl(`http://www.omdbapi.com/?s=${query}&apikey=${apiKey}`);
          }}
        >
          Search
        </button>

        <NominationsWrapper>
          <ResultsWrapper>
            <DisplayText size="small">{`Results for "${query}"`}</DisplayText>
            <StyledUList>
              {data &&
                data.Search &&
                data.Search.map((item) => {
                  return (
                    <li
                      id={`${item.Type}_${item.imdbID}`}
                      key={`result_${item.imdbID}`}
                    >
                      <span>{item.Title}&nbsp;</span>
                      <button
                        onClick={() => {
                          setNominations([...nominations, item]);
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
                    </li>
                  );
                })}
            </StyledUList>
          </ResultsWrapper>
          <ResultsWrapper>
            <DisplayText size="small">Nominations</DisplayText>
            <StyledUList>
              {nominations &&
                nominations.map((item) => {
                  return (
                    <li
                      id={`${item.type}_${item.imdbID}`}
                      key={`result_${item.imdbID}`}
                    >
                      <span>{item.Title}&nbsp;</span>
                      <button
                        onClick={() => {
                          setNominations(
                            nominations.filter((val) => val !== item)
                          );
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
