import { Marker, Popup } from "react-leaflet";
import {
  BerlinRacAddressContainer,
  BerlinRacCopyAddressWrapper,
  BerlinRacPopupContainer,
  PopupContentWrapper,
  PopupHeader,
} from "./styles";
import { IconName } from "../../Volunteers/icon";
import CardDetail from "../../Volunteers/CardDetail";
import { CardParagraph } from "../../Volunteers/VolunteerCard";
import { useTranslation } from "react-i18next";
import { CopyAddress } from "../CopyAddress";
import { useBerlinRacs } from "@/hooks/useBerlinRacs";
import { BerlinRacMarker } from "./types";

const BerlinRacs = () => {
  const { t } = useTranslation();
  const { berlinRacs, isLoading, isError } = useBerlinRacs();

  if (isLoading || isError) return null;

  return (
    berlinRacs &&
    berlinRacs.length > 0 &&
    berlinRacs?.map((rac: BerlinRacMarker) => (
      <Marker key={`${rac.id}-${rac.lat}-${rac.lon}`} position={[rac.lat, rac.lon]}>
        <Popup>
          <PopupContentWrapper>
            <PopupHeader>{rac.type}</PopupHeader>
            <BerlinRacPopupContainer>
              <BerlinRacCopyAddressWrapper>
                <CopyAddress address={[rac.street, rac.area, rac.district]} name={t("dashboard.map.address")} />
              </BerlinRacCopyAddressWrapper>
              <CardDetail header={t("dashboard.map.address")} iconName={IconName.MapPin}>
                {
                  <BerlinRacAddressContainer>
                    <CardParagraph text={rac.street} />
                    <CardParagraph text={rac.area} />
                    <CardParagraph text={rac.district} />
                  </BerlinRacAddressContainer>
                }
              </CardDetail>
            </BerlinRacPopupContainer>
          </PopupContentWrapper>
        </Popup>
      </Marker>
    ))
  );
};

export default BerlinRacs;
