import React, { ReactNode, createContext, useMemo, useState, useContext } from "react";

type MenuIds = "first" | "second" | "last";
type Menu = { id: MenuIds; title: string };

type SelectedMenu = {
  id: MenuIds;
};

type MenuAction = {
  onSelectedMenu: (selected: SelectedMenu) => void;
};

type MenuSelected = {
  selectedMenu: SelectedMenu;
};

const MenuSelectedContext = createContext<MenuSelected>({
  selectedMenu: { id: "first" },
});

const MenuActionContext = createContext<MenuAction>({
  onSelectedMenu: (selected: SelectedMenu) => {}, // Provide a default implementation or handle it accordingly
});

type PropsProvider = {
  children: ReactNode;
};

function MenuProvider({ children }: PropsProvider) {
  const [selectedMenu, setSelectedMenu] = useState<SelectedMenu>({ id: "first" });

  const menuContextAction = useMemo(
    () => ({
      onSelectedMenu: setSelectedMenu,
    }),
    []
  );

  const menuContextSelected = useMemo(
    () => ({
      selectedMenu,
    }),
    [selectedMenu]
  );

  return (
    <MenuActionContext.Provider value={menuContextAction}>
      <MenuSelectedContext.Provider value={menuContextSelected}>
        {children}
      </MenuSelectedContext.Provider>
    </MenuActionContext.Provider>
  );
}

type PropsMenu = {
  menus: Menu[];
};

function MenuComponent({ menus }: PropsMenu) {
  const { onSelectedMenu } = useContext(MenuActionContext);
  const { selectedMenu } = useContext(MenuSelectedContext);

  return (
    <>
      {menus.map((menu) => (
        <div key={menu.id} onClick={() => onSelectedMenu({ id: menu.id })}>
          {menu.title}{" "}
          {selectedMenu.id === menu.id ? "Selected" : "Not selected"}
        </div>
      ))}
    </>
  );
}

export function ComponentApp() {
  const menus: Menu[] = [
    {
      id: "first",
      title: "first",
    },
    {
      id: "second",
      title: "second",
    },
    {
      id: "last",
      title: "last",
    },
  ];

  return (
    <MenuProvider>
      <MenuComponent menus={menus} />
    </MenuProvider>
  );
}
