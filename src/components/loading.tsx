import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
    return (
        <div className="flex h-screen w-full items-center justify-center">
        <div className="flex w-full max-w-xs flex-col gap-4 [--radius:1rem]">
          <Item>
            <ItemMedia>
              <Spinner />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Loading...</ItemTitle>
            </ItemContent>
          </Item>
        </div>
      </div>
    )
}