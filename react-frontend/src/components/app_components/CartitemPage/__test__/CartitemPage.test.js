import React from "react";
import { render, screen } from "@testing-library/react";

import CartitemPage from "../CartitemPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders cartitem page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <CartitemPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("cartitem-datatable")).toBeInTheDocument();
    expect(screen.getByRole("cartitem-add-button")).toBeInTheDocument();
});
