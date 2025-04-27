import { ListPostItems } from "@/_components/posts/item";
import { Params } from "next/dist/server/request/params";

export default function Index(props: Params) {
  return (
    <ListPostItems props={props} category="travel-logs" title="Travel Logs" />
  );
}
