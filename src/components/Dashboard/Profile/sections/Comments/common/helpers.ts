import { apiPathUser } from "@/config/constants";
import axios from "axios";
import { TFunction } from "i18next";
import { toast } from "react-toastify";

export const getPersonIds = async (
  taggedUserIds: number[],
  setIsTagFetch: (arg: boolean) => void,
  t: TFunction<"translation", undefined>,
) => {
  if (!taggedUserIds.length) return;
  const promiseArray = taggedUserIds.map(async (id) => {
    setIsTagFetch(true);
    try {
      const response = await axios.get(`${apiPathUser}/${id}`);
      return response.data.data.personId;
    } catch (err) {
      console.error(err);
      toast.error(t("dashboard.commentsSection.errorTagging"));
      return null;
    } finally {
      setIsTagFetch(false);
    }
  });
  const resolvedPersonIds = await Promise.all(promiseArray);
  return resolvedPersonIds?.filter((id): id is number => id !== null);
};
