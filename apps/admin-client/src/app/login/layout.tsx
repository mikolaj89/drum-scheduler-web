"use client";

import type { PropsWithChildren } from "react";
import { ReactQueryProvider } from "../../providers/ReactQueryProvider";
import theme from "@/components/layout/theme";
import { BRANDING } from "@drum-scheduler/config";
import {
  AppBar,
  Box,
  CssBaseline,
  Toolbar,
  Typography,
} from "@mui/material";
import ThemeProvider from "@mui/material/styles/ThemeProvider";

export default function LoginLayout({ children }: PropsWithChildren) {
  return (
    <ThemeProvider theme={theme}>
      <ReactQueryProvider>
        <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <CssBaseline />
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" noWrap>
                {BRANDING.appName}
              </Typography>
            </Toolbar>
          </AppBar>
          <Box
            component="main"
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: 2,
            }}
          >
            {children}
          </Box>
          <Box component="footer" sx={{ py: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              {BRANDING.legalName}
            </Typography>
          </Box>
        </Box>
      </ReactQueryProvider>
    </ThemeProvider>
  );
}
