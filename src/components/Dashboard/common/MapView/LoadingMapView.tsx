import React from "react";
import { LoadingContainer, LoadingMapCard, LoadingSidebar } from "./styles";

export const LoadingMapView = ({ showSideBar = false }) => {
  return (
    <LoadingContainer>
      {showSideBar && <LoadingSidebar />}
      <LoadingMapCard />
    </LoadingContainer>
  );
};
