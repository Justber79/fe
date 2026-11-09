import "leaflet/dist/leaflet.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.Default.css";
import "./map.css";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import MarkerClusterGroup from "react-leaflet-cluster";
import { MapContainer as LeafletMapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { ApiDistrictAggregate, QueryParamsKeys, UserRole } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { useScreenType } from "@/context/DeviceContext";
import { questionMark, ScreenTypes } from "@/config/constants";
import { useCurrentUserQuery } from "@/hooks/useCurrentUser";
import { BerlinRacs } from "./layers/BerlinRacs";
import { DistrictPolygons } from "./layers/DistrictPolygons";
import { MapLegendControl } from "./controls/MapLegend";
import { MapOtherRacs } from "./controls/MapOtherRacs";
import { MapPopupControlVisibility } from "./controls/MapPopupVisibilityControl";
import { MapScroll } from "./controls/MapScroll";
import { MapSizeInvalidator } from "./controls/MapSizeInvalidator";
import { BERLIN_BOUNDS, DEFAULT_CENTER } from "./helpers";
import { createDistrictMarkers, getDistrictMarkerItems } from "./districtMarkers";
import { getMarkerIcon, getSingleMarkerIcon } from "./markerIcons";
import {
  DistrictCount,
  DistrictCountChips,
  DistrictMapButton,
  DistrictMapLayout,
  DistrictMapList,
  DistrictMapListItem,
  DistrictMapPanel,
  DistrictMapSectionTitle,
  DistrictMapStatus,
  DistrictSelectedHeader,
  DistrictSelectedTitle,
  MapBucketChip,
  MapResultLink,
  StyledMapContainer,
} from "./styles";
import { useGetDistrictGeometry } from "@/hooks/useGetDistrictGeometry";
import { EntityMarker, MapEntity, SingleMarker } from "./types";
import { Button } from "@/components/core/button";
import { useGetAggregateDistricts } from "@/hooks/useGetAggregateDistricts";
import { useGetMapMarkers } from "@/hooks/useGetMapMarkers";

interface Props {
  entity: MapEntity;
  filter: URLSearchParams;
  renderPopupContent: (marker: EntityMarker) => React.ReactNode;
  filterMarker?: SingleMarker | null;
  renderSinglePopupContent?: (marker: SingleMarker) => React.ReactNode;
  onCountChange: (count: number) => void;
}

const MapCard = ({
  entity,
  filter,
  renderPopupContent,
  filterMarker,
  renderSinglePopupContent,
  onCountChange,
}: Props) => {
  const [enableScroll, setEnableScroll] = useState(true);
  const [showOtherRacs, setShowOtherRacs] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const screenSize = useScreenType();
  const { data: currentUser, isLoading: isUserLoading } = useCurrentUserQuery(entity === MapEntity.VOLUNTEER);
  const canFetchVolunteerMarkers =
    entity !== MapEntity.VOLUNTEER ||
    (!isUserLoading && (currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.COORDINATOR));
  const { data: districtGeometries, isError: isGeometryError, isLoading: isGeometryLoading } = useGetDistrictGeometry();
  const districtParamValues = searchParams.getAll(QueryParamsKeys.DISTRICT);
  const districtParamKey = districtParamValues.join("|");
  const candidateDistrictId =
    districtParamValues.length === 1 && /^\d+$/.test(districtParamValues[0])
      ? Number(districtParamValues[0])
      : undefined;
  const selectedDistrict =
    districtParamValues.length === 1
      ? districtGeometries?.features.find(
          ({ properties }) =>
            properties.districtId === candidateDistrictId || properties.title === districtParamValues[0],
        )
      : undefined;
  const selectedDistrictId = selectedDistrict?.properties.districtId;
  const hasUnsupportedDistrictFilter =
    districtParamValues.length > 0 && (districtParamValues.length !== 1 || selectedDistrictId === undefined);
  const selectedDistrictIds = useMemo(
    () =>
      new Set(
        districtParamKey
          .split("|")
          .filter(Boolean)
          .flatMap((value) => {
            const feature = districtGeometries?.features.find(
              ({ properties }) => properties.districtId === Number(value) || properties.title === value,
            );
            return feature ? [feature.properties.districtId] : [];
          }),
      ),
    [districtParamKey, districtGeometries],
  );
  const unsupportedFilterKeys: Record<MapEntity, string[]> = {
    [MapEntity.AGENT]: ["search"],
    [MapEntity.OPPORTUNITY]: ["search"],
    [MapEntity.VOLUNTEER]: ["search"],
  };
  const hasUnsupportedFilters =
    hasUnsupportedDistrictFilter ||
    unsupportedFilterKeys[entity].some((key) => filter.getAll(key).some((value) => value.length > 0));
  const filterString = filter.toString();
  const serializedFilter = useMemo(() => {
    const supportedFilters: Record<MapEntity, string[]> = {
      [MapEntity.AGENT]: ["type", "status", "engagementStatus", "services", "volunteerSearch"],
      [MapEntity.OPPORTUNITY]: ["type", "status", "agentId", "match", "activity", "skill", "language", "availability"],
      [MapEntity.VOLUNTEER]: ["type", "language", "activity", "skill", "availability", "engagement", "match"],
    };
    const params = new URLSearchParams(filterString);
    const supported = new Set(supportedFilters[entity]);
    Array.from(params.keys()).forEach((key) => {
      if (!supported.has(key)) params.delete(key);
    });
    return params;
  }, [filterString, entity]);

  const {
    data: aggregate,
    isError: isAggregateError,
    isLoading: isAggregateLoading,
  } = useGetAggregateDistricts(entity, hasUnsupportedFilters, serializedFilter);

  const {
    data: markerData,
    isError: isMarkerError,
    isLoading: isMarkerLoading,
  } = useGetMapMarkers(
    entity,
    hasUnsupportedFilters,
    serializedFilter,
    i18n.resolvedLanguage ?? i18n.language,
    selectedDistrictId,
    canFetchVolunteerMarkers,
  );

  const districtCounts = useMemo(() => {
    const counts = new Map(aggregate?.districts.map(({ districtId, count }) => [districtId, count]) ?? []);
    if (selectedDistrictId !== undefined && markerData) {
      counts.set(selectedDistrictId, markerData.total);
    }
    return counts;
  }, [aggregate, markerData, selectedDistrictId]);
  const districtTitles = useMemo(
    () =>
      new Map(districtGeometries?.features.map(({ properties }) => [properties.districtId, properties.title]) ?? []),
    [districtGeometries],
  );
  const markers = useMemo(
    () =>
      createDistrictMarkers(
        markerData?.markers ?? [],
        entity,
        t,
        (i18n.resolvedLanguage ?? i18n.language).split("-")[0],
        districtTitles,
      ),
    [markerData, entity, t, i18n.language, i18n.resolvedLanguage, districtTitles],
  );
  const volunteerItems = useMemo(() => getDistrictMarkerItems(markerData?.markers ?? []), [markerData]);
  const selectedDistrictTitle = selectedDistrict?.properties.title ?? "";
  const aggregateTotal = aggregate
    ? aggregate.districts.reduce((sum, { count }) => sum + count, 0) +
      aggregate.unassignedBerlin +
      aggregate.outsideBerlin +
      aggregate.remote
    : 0;
  const displayedTotal = selectedDistrictId ? (markerData?.total ?? 0) : aggregateTotal;
  const hasTruncatedMarkers = Boolean(markerData && markerData.total > markerData.maxEntities);
  const hasMapError = isGeometryError || isAggregateError || isMarkerError;

  useEffect(() => {
    if (!hasUnsupportedFilters && (selectedDistrictId ? markerData : aggregate)) {
      onCountChange(displayedTotal);
    }
  }, [aggregate, displayedTotal, hasUnsupportedFilters, markerData, onCountChange, selectedDistrictId]);

  const handleDistrictClick = (districtId: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    if (selectedDistrictIds.has(districtId)) {
      params.delete(QueryParamsKeys.DISTRICT);
    } else {
      params.delete(QueryParamsKeys.DISTRICT);
      params.append(QueryParamsKeys.DISTRICT, String(districtId));
    }
    router.push(pathname + questionMark + params.toString(), { scroll: false });
  };

  const handleBackToOverview = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    params.delete(QueryParamsKeys.DISTRICT);
    router.push(pathname + questionMark + params.toString(), { scroll: false });
  };

  const getViewLink = (view: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", view);
    params.delete("page");
    return `${pathname}?${params.toString()}`;
  };

  const mapZoom = screenSize === ScreenTypes.MOBILE ? 8 : 10;
  const getDistrictCount = (aggregate: ApiDistrictAggregate | undefined, districtId: number) =>
    aggregate?.districts.find((district) => district.districtId === districtId)?.count ?? 0;
  return (
    <DistrictMapPanel>
      {selectedDistrictId && (
        <DistrictSelectedHeader>
          <div>
            <DistrictSelectedTitle>{selectedDistrictTitle || `District ${selectedDistrictId}`}</DistrictSelectedTitle>
            {!hasUnsupportedFilters && (
              <DistrictMapStatus>
                {isMarkerLoading
                  ? t("dashboard.map.loading")
                  : markerData
                    ? t("dashboard.map.selectedDistrictCount", { count: markerData.total })
                    : ""}
              </DistrictMapStatus>
            )}
          </div>
          <Button
            text={t("dashboard.map.backToOverview")}
            textColor="var(--color-white)"
            onClick={handleBackToOverview}
          />
        </DistrictSelectedHeader>
      )}
      {hasMapError && <DistrictMapStatus role="alert">{t("dashboard.map.loadError")}</DistrictMapStatus>}
      {hasUnsupportedFilters && (
        <DistrictMapStatus role="status">{t("dashboard.map.unsupportedFilters")}</DistrictMapStatus>
      )}
      <DistrictCountChips aria-label={t("dashboard.map.additionalCounts")}>
        <MapBucketChip>
          {t("dashboard.map.unassignedBerlin")}: <strong>{aggregate?.unassignedBerlin}</strong>
        </MapBucketChip>
        <MapBucketChip>
          {t("dashboard.map.outsideBerlin")}: <strong>{aggregate?.outsideBerlin}</strong>
        </MapBucketChip>
        <MapBucketChip>
          {t("dashboard.map.remote")}: <strong>{aggregate?.remote}</strong>
        </MapBucketChip>
      </DistrictCountChips>
      <DistrictMapLayout>
        <StyledMapContainer>
          <LeafletMapContainer center={DEFAULT_CENTER} minZoom={10} zoom={mapZoom} maxBounds={BERLIN_BOUNDS}>
            <MapSizeInvalidator />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapPopupControlVisibility />
            <MapLegendControl />
            {screenSize === ScreenTypes.DESKTOP && (
              <MapScroll enableScroll={enableScroll} setEnabledScroll={setEnableScroll} />
            )}
            {screenSize !== ScreenTypes.MOBILE && (
              <MapOtherRacs showOtherRacs={showOtherRacs} setShowOtherRacs={setShowOtherRacs} />
            )}
            {districtGeometries && (
              <DistrictPolygons
                districtGeometries={districtGeometries}
                districtCounts={districtCounts}
                selectedDistrictIds={selectedDistrictIds}
                showCounts={!hasUnsupportedFilters && Boolean(aggregate || markerData)}
                onDistrictClick={handleDistrictClick}
              />
            )}
            {showOtherRacs && <BerlinRacs />}
            {filterMarker && (
              <Marker
                position={[filterMarker.lat, filterMarker.lon]}
                icon={getSingleMarkerIcon(filterMarker)}
                zIndexOffset={200}
              >
                <Popup>{renderSinglePopupContent?.(filterMarker)}</Popup>
              </Marker>
            )}
            {selectedDistrictId && (
              <MarkerClusterGroup chunkedLoading showCoverageOnHover={false} spiderfyOnMaxZoom>
                {markers.map((marker, index) => (
                  <Marker
                    key={`${marker.lat},${marker.lon},${index}`}
                    position={[marker.lat, marker.lon]}
                    icon={getMarkerIcon(entity, marker.children?.length ?? 0)}
                    zIndexOffset={100}
                  >
                    <Popup>
                      <div className="district-map-popup">
                        <strong>{marker.label}</strong>
                        {renderPopupContent(marker)}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MarkerClusterGroup>
            )}
          </LeafletMapContainer>
        </StyledMapContainer>
        <section aria-label={t("dashboard.map.districtList")}>
          <DistrictMapSectionTitle>{t("dashboard.map.districtList")}</DistrictMapSectionTitle>
          {isGeometryLoading || isAggregateLoading ? (
            <DistrictMapStatus role="status">{t("dashboard.map.loading")}</DistrictMapStatus>
          ) : districtGeometries ? (
            <DistrictMapList>
              {districtGeometries.features.map(({ properties }) => {
                const count = getDistrictCount(aggregate, properties.districtId);
                return (
                  <DistrictMapListItem key={properties.districtId}>
                    <DistrictMapButton
                      $isSelected={selectedDistrictIds.has(properties.districtId)}
                      aria-pressed={selectedDistrictIds.has(properties.districtId)}
                      onClick={() => handleDistrictClick(properties.districtId)}
                    >
                      <span>{properties.title}</span>
                      <DistrictCount>
                        {hasUnsupportedFilters
                          ? "—"
                          : selectedDistrictId
                            ? properties.districtId === selectedDistrictId
                              ? (markerData?.total ?? "—")
                              : "—"
                            : count}
                      </DistrictCount>
                    </DistrictMapButton>
                  </DistrictMapListItem>
                );
              })}
            </DistrictMapList>
          ) : null}
        </section>
      </DistrictMapLayout>
      {!hasUnsupportedFilters && !selectedDistrictId && aggregate && (
        <>
          {aggregateTotal === 0 && (
            <DistrictMapStatus role="status">{t("dashboard.map.emptyOverview")}</DistrictMapStatus>
          )}
        </>
      )}
      {selectedDistrictId && (
        <>
          {!hasUnsupportedFilters && markerData && markerData.total === 0 && (
            <DistrictMapStatus role="status">{t("dashboard.map.emptyDistrict")}</DistrictMapStatus>
          )}
          {!hasUnsupportedFilters && entity === MapEntity.VOLUNTEER && volunteerItems.length > 0 && (
            <DistrictMapList aria-label={t("dashboard.map.volunteersInterested", { district: selectedDistrictTitle })}>
              {volunteerItems.map((item) => (
                <DistrictMapListItem key={`${item.entity}-${item.id}`}>
                  <a href={`/${i18n.resolvedLanguage ?? i18n.language}/dashboard/volunteers/${item.id}`}>
                    {item.title}
                  </a>
                </DistrictMapListItem>
              ))}
            </DistrictMapList>
          )}
          {!hasUnsupportedFilters && hasTruncatedMarkers && (
            <DistrictMapStatus role="status">
              {t("dashboard.map.truncated", { max: markerData?.maxEntities })}{" "}
              <MapResultLink href={getViewLink("cards")}>{t("dashboard.map.viewAllResults")}</MapResultLink>
            </DistrictMapStatus>
          )}
        </>
      )}
    </DistrictMapPanel>
  );
};

export default MapCard;
