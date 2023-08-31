export const data = [
  {
    id: "homepage",
    name: "Homepage",
    pattern: "{%start%}",
  },
  {
    id: "ZMIRoot",
    name: "ZMI Root",
    pattern: "{%start%}/manage_main",
  },
  {
    id: "ZMIinplace",
    name: "ZMI in place",
    pattern: "{%start%}{%path%}/manage_main",
  },
  {
    id: "portal catalog",
    name: "Portal Catalog",
    pattern: "{%start%}/portal_catalog/manage_main",
  },
  {
    id: "catalogportaltype",
    name: "Catalog portal type",
    pattern: "{%start%}/portal_catalog/Indexes/portal_type/manage_browse",
  },
  {
    id: "upgradestep",
    name: "Upgrade step",
    pattern: "{%start%}/portal_setup/manage_upgrades",
  },
  {
    id: "registry",
    name: "Registry",
    pattern: "{%start%}/portal_registry",
  },
  {
    id: "controlpanel",
    name: "Control Panel",
    pattern: "{%start%}/@@overview-controlpanel",
  },
  {
    id: "modules",
    name: "Modules",
    pattern: "{%start%}/prefs_install_products_form",
  },
  {
    id: "foldercontent",
    name: "Folder Content",
    pattern: "{%start%}{%path%}/folder_contents",
  },
  {
    id: "viewletmanager",
    name: "Viewlet Manager",
    pattern: "{%start%}{%path%}/@@manage-viewlets",
  },
  {
    id: "exportcontent",
    name: "Export Content",
    pattern: "{%start%}{%path%}/@@export_content",
  },
  {
    id: "disablediazo",
    name: "Disable Diazo",
    pattern: "{%start%}{%path%}{%query%}?diazo.off=1",
    query: true,
  },
  {
    id: "undo",
    name: "Undo",
    pattern: "{%start%}/Control_Panel/Database/main/manage_UndoForm",
  },
];
