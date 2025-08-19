"use client";
import React from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, useMediaQuery } from "@mui/material";
import { Home, Settings, Info } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

const drawerWidth = 200;   // Full size
const miniWidth = 70;      // Only icons size

export default function ResponsiveSidebar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // true if screen < 600px

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isMobile ? miniWidth : drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isMobile ? miniWidth : drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <List>
        {/* Home */}
        <ListItem>
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          {!isMobile && <ListItemText primary="Home" />}
        </ListItem>

        {/* Settings */}
        <ListItem>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          {!isMobile && <ListItemText primary="Settings" />}
        </ListItem>

        {/* About */}
        <ListItem>
          <ListItemIcon>
            <Info />
          </ListItemIcon>
          {!isMobile && <ListItemText primary="About" />}
        </ListItem>
      </List>
    </Drawer>
  );
}
