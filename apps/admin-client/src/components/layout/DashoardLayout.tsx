"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton, ThemeProvider,
  Toolbar,
  Typography
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";
import theme from "./theme";
import { NavBar } from "./NavBar";

const EXPANDED_WIDTH = 240;
const COLLAPSED_WIDTH = 0; // Width when collapsed

export const DashboardLayout = ({ children }: PropsWithChildren) => {
  const [open, setOpen] = useState(true);
  const [currentDrawerWidth, setCurrentDrawerWidth] = useState(EXPANDED_WIDTH);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  useEffect(() => {
    setCurrentDrawerWidth(open ? EXPANDED_WIDTH : COLLAPSED_WIDTH);
  }, [open]);

  return (
    <ThemeProvider theme={theme}>
    <ReactQueryProvider>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Drawer
          variant="permanent"
          sx={{
            width: currentDrawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: currentDrawerWidth,
              transition: "width 0.3s",
              overflowX: "hidden",
              boxSizing: "border-box",
            },
          }}
        >
          <NavBar/>
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <AppBar
            sx={{
              width: `calc(100% - ${currentDrawerWidth}px)`,
              transition: "width 0.3s",
              boxSizing: "border-box",
              ml: `${currentDrawerWidth}px`,
            }}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                edge="start"
                sx={{ mr: 2 }}
                onClick={toggleDrawer}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap>
                Drum session scheduler
              </Typography>
            </Toolbar>
          </AppBar>

          <Box sx={{marginTop: 7}}>{children}</Box>
        </Box>
      </Box>
    </ReactQueryProvider>
    </ThemeProvider>
  );
};
