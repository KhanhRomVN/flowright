import { createMemoryHistory, createRouter } from "@tanstack/react-router";
import { rootTree } from "./routes";
import NotFound from "@/pages/NotFoundPage";

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

const history = createMemoryHistory({
    initialEntries: ["/"],
});
export const router = createRouter({ routeTree: rootTree, history: history, defaultNotFoundComponent: NotFound });
