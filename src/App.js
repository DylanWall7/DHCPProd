import React, { useState, useEffect } from "react";
import { PageLayout } from "./components/PageLayout";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import { loginRequest } from "./authConfig";

import { ProfileData } from "./components/ProfileData";
import { callMsGraph, callDHCP } from "./graph";

import {
  ChakraProvider,
  Box,
  Heading,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  TabIndicator,
} from "@chakra-ui/react";

import SearchScope from "./components/SearchScope";
import { InfoIcon } from "@chakra-ui/icons";

import { NextUIProvider } from "@nextui-org/react";

import SearchSiteScope from "./components/SearchSiteScope";

import MockAllLeases from "./components/MockAllLeases";
import MockDelandUpdate from "./components/MockDelandUpdate";

import MockSearchIP from "./components/MockSearchIP";
import MockSearchMAC from "./components/MockSearchMAC";
import Add from "./Images/add0.jpg";
import Edit from "./Images/edit0.jpg";
import Del from "./Images/del0.jpg";

function App() {
  return (
    <NextUIProvider>
      <ChakraProvider>
        <PageLayout>
          <AuthenticatedTemplate>
            {/* <div className="px-4 py-3 text-black bg-yellow-500">
            <p className="text-sm font-medium text-center">
              This tool is currently under development. Modifications will be
              made frequently and you may encounter bugs.
            </p>
          </div> */}

            <Tabs variant="enclosed" colorScheme="green" mt={6}>
              <TabList
                textAlign={"center"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Tab>Scope Info</Tab>
                <Tab>Create / Edit Reservations</Tab>
                <Tab>Reservation Lookup</Tab>
                <Tab>Lease Lookup by MAC</Tab>
                {/* <Tab>Instructions</Tab> */}
              </TabList>
              <TabIndicator
                mt="-1.5px"
                height="2px"
                bg="green"
                borderRadius="12px"
              />
              {/* <DarkModeSwitch /> */}
              <TabPanels>
                <TabPanel>
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-12 xl:col-span-8">
                      <SearchSiteScope />
                    </div>

                    <div className="col-span-4 md:col-span-12 xl:col-span-4">
                      <SearchScope />
                    </div>
                  </div>

                  {/* <div className="grid grid-cols-3 gap-4 break-after-auto ">
                    <div className="col-span-2 sm:col-span-2 ">
                      <SearchSiteScope />
                    </div>
                    <div className="col-span-1">
                      <SearchScope />
                    </div>
                  </div> */}
                </TabPanel>
                <TabPanel>
                  <div className="grid grid-cols-12 gap-4 ">
                    <div className="row-span-12 md:col-span-12 xl:col-span-5">
                      <MockAllLeases />
                    </div>

                    <div className="col-span-12 md:col-span-12 xl:col-span-7">
                      <MockDelandUpdate />
                    </div>
                  </div>
                  {/* <SimpleGrid minChildWidth="650px" spacing="40px">
                    <Box height="100%"> */}
                  {/* <SearchIP /> */}
                  {/* <MockAllLeases /> */}
                  {/* <AllActiveLeases /> */}
                  {/* <MockSearchIP /> */}
                  {/* </Box>

                    <Box height="100%"> */}
                  {/* <AllReservationsForScope /> */}
                  {/* <MockDelandUpdate />
                    </Box>
                  </SimpleGrid> */}
                </TabPanel>
                <TabPanel>
                  <SimpleGrid minChildWidth="620px" spacing="40px">
                    <Box height="100%">
                      <MockSearchIP />
                    </Box>
                  </SimpleGrid>
                </TabPanel>
                <TabPanel>
                  <SimpleGrid minChildWidth="620px" spacing="40px">
                    <Box height="100%">
                      <MockSearchMAC />
                    </Box>
                  </SimpleGrid>
                </TabPanel>
                <TabPanel>
                  <section className="text-black bg-white ml-6">
                    <div className="px-4 py-16 max-w-screen-xl sm:px-6 lg:px-8">
                      <div className="max-w-xl">
                        <h2 className="text-3xl font-bold sm:text-4xl">
                          DHCP Tool Functions
                        </h2>

                        <p className="mt-4 text-black">
                          This tool has been created to facilitate the search of
                          DHCP scope information. This tool also allows you to
                          search for current reservations, leases, and scope
                          statistics. You also have the ability to convert an
                          active lease to a reservation, edit an existing
                          reservation description, or delete a reservation.
                        </p>
                      </div>

                      <div className="mt-8 grid grid-cols-1 gap-8 md:gap-12 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
                        <div className="flex items-start">
                          <span className="flex-shrink-0 p-4 bg-gray-300 rounded-lg">
                            <svg
                              version="1.0"
                              xmlns="http://www.w3.org/2000/svg"
                              width="15.000000pt"
                              height="15.000000pt"
                              viewBox="0 0 1076.000000 1280.000000"
                              preserveAspectRatio="xMidYMid meet"
                            >
                              <metadata>
                                Created by potrace 1.15, written by Peter
                                Selinger 2001-2017
                              </metadata>
                              <g
                                transform="translate(0.000000,1280.000000) scale(0.100000,-0.100000)"
                                fill="#000000"
                                stroke="none"
                              >
                                <path
                                  d="M7105 12794 c-465 -36 -895 -155 -1305 -360 -988 -495 -1676 -1438
-1845 -2530 -57 -371 -55 -725 6 -1089 81 -483 253 -920 524 -1330 128 -193
243 -334 418 -513 118 -119 145 -152 128 -152 -12 0 -36 -13 -52 -29 -24 -24
-29 -38 -29 -76 0 -25 5 -55 10 -66 13 -24 14 -24 -56 8 -83 38 -163 39 -200
2 -31 -31 -35 -89 -10 -138 22 -41 20 -48 -13 -54 -24 -5 -92 -88 -412 -509
-211 -277 -389 -516 -397 -531 -8 -15 -11 -38 -8 -51 6 -23 5 -23 -68 -18 -70
4 -76 3 -100 -21 -37 -37 -35 -94 4 -164 l30 -53 -68 49 c-80 58 -116 71 -192
71 -43 0 -71 -7 -118 -31 -59 -29 -68 -40 -279 -317 -121 -158 -772 -1014
-1448 -1902 -676 -888 -1311 -1723 -1412 -1855 -146 -191 -187 -251 -199 -294
-22 -73 -14 -147 24 -214 26 -46 69 -82 373 -315 189 -144 361 -272 383 -283
96 -51 221 -31 305 49 54 51 3217 4205 3258 4278 34 60 41 145 18 214 -18 53
-70 116 -145 172 l-35 27 45 -16 c59 -19 124 -12 156 18 30 28 32 85 5 146
l-19 42 26 6 c15 3 34 11 43 18 13 10 298 381 707 920 63 84 82 116 82 141 l0
32 69 -4 c64 -4 72 -2 95 21 47 47 30 131 -44 218 l-39 47 54 4 c66 6 101 33
112 89 l8 39 85 -51 c408 -246 877 -404 1380 -465 166 -20 536 -23 705 -5
1081 114 2007 689 2578 1600 260 416 425 881 494 1396 24 181 24 636 0 820
-126 952 -594 1762 -1342 2325 -490 369 -1020 583 -1650 666 -105 14 -536 26
-640 18z m635 -149 c435 -55 831 -185 1210 -397 1066 -597 1715 -1746 1677
-2968 -16 -512 -138 -979 -371 -1425 -404 -775 -1101 -1359 -1931 -1619 -328
-103 -641 -149 -1000 -149 -288 1 -515 28 -780 94 -835 208 -1549 728 -2009
1462 -397 635 -569 1452 -460 2192 118 806 507 1517 1119 2044 529 456 1212
734 1925 785 115 8 500 -4 620 -19z"
                                />
                              </g>
                            </svg>
                          </span>

                          <div className="ml-4">
                            <h2 className="text-lg font-bold">
                              Scope Info Tab
                            </h2>

                            <p className="mt-1 text-sm text-black">
                              The scope info tab allows you to search for all
                              scopes at any location with the site code, or to
                              obtain more information using the scope ID. By
                              using the scope ID, you will get all of the
                              information for the scope as well as the
                              statistics for that scope.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <span className="flex-shrink-0 p-4 bg-gray-300 rounded-lg">
                            <svg
                              version="1.0"
                              xmlns="http://www.w3.org/2000/svg"
                              width="15.000000pt"
                              height="15.000000pt"
                              viewBox="0 0 1156.000000 1280.000000"
                              preserveAspectRatio="xMidYMid meet"
                            >
                              <metadata>
                                Created by potrace 1.15, written by Peter
                                Selinger 2001-2017
                              </metadata>
                              <g
                                transform="translate(0.000000,1280.000000) scale(0.100000,-0.100000)"
                                fill="#000000"
                                stroke="none"
                              >
                                <path
                                  d="M182 12789 c-46 -14 -115 -85 -130 -135 -17 -58 -18 -8967 -1 -9025
16 -52 64 -108 113 -130 39 -18 108 -19 1709 -19 l1667 0 0 -250 0 -250 -955
0 -955 0 0 -429 0 -429 -697 -503 c-384 -276 -751 -540 -816 -587 l-117 -84 0
-474 0 -474 5780 0 5780 0 0 474 0 473 -815 587 -815 587 0 430 0 429 -955 0
-955 0 0 250 0 250 1659 2 1659 3 44 30 c23 17 54 51 68 75 l25 45 0 4505 0
4505 -25 45 c-14 24 -45 58 -68 75 l-44 30 -5561 2 c-3527 1 -5574 -2 -5595
-8z m10371 -593 c39 -16 82 -61 96 -99 8 -20 11 -1197 11 -3929 l0 -3900 -22
-40 c-13 -22 -41 -51 -64 -64 l-41 -24 -4792 0 c-4754 0 -4792 0 -4831 20 -45
23 -73 60 -89 115 -15 55 -16 7743 0 7798 12 46 63 105 104 123 46 20 9581 20
9628 0z m-300 -10679 l727 -522 -2600 -3 c-1430 -1 -3770 -1 -5201 0 l-2601 3
728 522 729 522 3745 0 3745 0 728 -522z"
                                />
                              </g>
                            </svg>
                          </span>

                          <div className="ml-4">
                            <h2 className="text-lg font-bold">
                              Create/Edit Reservation Tab
                            </h2>

                            <p className="mt-1 text-sm text-black">
                              The Create/Edit tab will allow you to convert,
                              create, edit, and delete reservations. You will
                              need to search by the scope ID, and that info can
                              be found in the scope info tab with a simple
                              search of the site code. Doing so will list all of
                              the scopes at that location.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <span className="flex-shrink-0 p-4 bg-gray-300 rounded-lg">
                            <svg
                              version="1.0"
                              xmlns="http://www.w3.org/2000/svg"
                              width="15.000000pt"
                              height="15.000000pt"
                              viewBox="0 0 1076.000000 1280.000000"
                              preserveAspectRatio="xMidYMid meet"
                            >
                              <metadata>
                                Created by potrace 1.15, written by Peter
                                Selinger 2001-2017
                              </metadata>
                              <g
                                transform="translate(0.000000,1280.000000) scale(0.100000,-0.100000)"
                                fill="#000000"
                                stroke="none"
                              >
                                <path
                                  d="M7105 12794 c-465 -36 -895 -155 -1305 -360 -988 -495 -1676 -1438
-1845 -2530 -57 -371 -55 -725 6 -1089 81 -483 253 -920 524 -1330 128 -193
243 -334 418 -513 118 -119 145 -152 128 -152 -12 0 -36 -13 -52 -29 -24 -24
-29 -38 -29 -76 0 -25 5 -55 10 -66 13 -24 14 -24 -56 8 -83 38 -163 39 -200
2 -31 -31 -35 -89 -10 -138 22 -41 20 -48 -13 -54 -24 -5 -92 -88 -412 -509
-211 -277 -389 -516 -397 -531 -8 -15 -11 -38 -8 -51 6 -23 5 -23 -68 -18 -70
4 -76 3 -100 -21 -37 -37 -35 -94 4 -164 l30 -53 -68 49 c-80 58 -116 71 -192
71 -43 0 -71 -7 -118 -31 -59 -29 -68 -40 -279 -317 -121 -158 -772 -1014
-1448 -1902 -676 -888 -1311 -1723 -1412 -1855 -146 -191 -187 -251 -199 -294
-22 -73 -14 -147 24 -214 26 -46 69 -82 373 -315 189 -144 361 -272 383 -283
96 -51 221 -31 305 49 54 51 3217 4205 3258 4278 34 60 41 145 18 214 -18 53
-70 116 -145 172 l-35 27 45 -16 c59 -19 124 -12 156 18 30 28 32 85 5 146
l-19 42 26 6 c15 3 34 11 43 18 13 10 298 381 707 920 63 84 82 116 82 141 l0
32 69 -4 c64 -4 72 -2 95 21 47 47 30 131 -44 218 l-39 47 54 4 c66 6 101 33
112 89 l8 39 85 -51 c408 -246 877 -404 1380 -465 166 -20 536 -23 705 -5
1081 114 2007 689 2578 1600 260 416 425 881 494 1396 24 181 24 636 0 820
-126 952 -594 1762 -1342 2325 -490 369 -1020 583 -1650 666 -105 14 -536 26
-640 18z m635 -149 c435 -55 831 -185 1210 -397 1066 -597 1715 -1746 1677
-2968 -16 -512 -138 -979 -371 -1425 -404 -775 -1101 -1359 -1931 -1619 -328
-103 -641 -149 -1000 -149 -288 1 -515 28 -780 94 -835 208 -1549 728 -2009
1462 -397 635 -569 1452 -460 2192 118 806 507 1517 1119 2044 529 456 1212
734 1925 785 115 8 500 -4 620 -19z"
                                />
                              </g>
                            </svg>
                          </span>

                          <div className="ml-4">
                            <h2 className="text-lg font-bold">
                              Reservation Lookup Tab
                            </h2>

                            <p className="mt-1 text-sm text-black">
                              The reservation lookup tab will allow you to
                              search for a specific reservation by IP or MAC
                              address. You can search for a reservation with the
                              entire IP address or by the MAC, Example:
                              aa-bb-cc-dd-ee-ff or Partial Matching: 00-1b-78.
                              This will return all reservations that contain the
                              partial MAC address.
                            </p>
                          </div>
                        </div>

                        {/* <div className="flex items-start">
                        <span className="flex-shrink-0 p-4 bg-gray-300 rounded-lg">
                          <svg
                            version="1.0"
                            xmlns="http://www.w3.org/2000/svg"
                            width="15.000000pt"
                            height="15.000000pt"
                            viewBox="0 0 1082.000000 1280.000000"
                            preserveAspectRatio="xMidYMid meet"
                          >
                            <metadata>
                              Created by potrace 1.15, written by Peter Selinger
                              2001-2017
                            </metadata>
                            <g
                              transform="translate(0.000000,1280.000000) scale(0.100000,-0.100000)"
                              fill="#000000"
                              stroke="none"
                            >
                              <path
                                d="M3230 12789 c-406 -40 -836 -193 -1252 -445 -151 -92 -352 -232 -371
-258 -24 -35 -47 -102 -47 -140 0 -25 -19 -53 -96 -141 -253 -289 -278 -315
-356 -367 l-79 -51 -33 16 c-37 17 -71 13 -141 -17 -22 -10 -103 -40 -180 -68
-296 -106 -457 -187 -563 -283 -58 -52 -112 -132 -112 -164 0 -30 26 -68 304
-446 153 -208 255 -358 292 -427 63 -119 125 -190 198 -227 85 -42 147 -7 361
199 77 74 198 184 268 243 148 126 182 170 174 222 -5 32 -2 38 46 78 97 81
226 143 386 186 l146 39 155 -18 c143 -16 164 -21 273 -66 l118 -49 158 -175
c353 -392 812 -1021 1337 -1830 321 -495 343 -533 1212 -1970 294 -487 561
-922 594 -967 l59 -82 -9 -66 -9 -66 111 -157 c62 -86 197 -283 301 -437 380
-564 556 -811 935 -1315 625 -833 1100 -1512 1283 -1835 66 -115 184 -314 262
-441 130 -210 145 -239 164 -316 36 -155 54 -321 46 -452 -5 -94 -3 -140 11
-212 l17 -93 71 -74 71 -74 127 -22 127 -22 154 55 c233 84 433 200 662 384
99 79 219 182 267 228 76 73 90 92 118 162 l33 80 -22 94 c-19 84 -29 106 -96
205 -51 76 -129 169 -253 301 -163 174 -189 207 -301 381 -83 129 -178 298
-291 519 -92 180 -262 491 -379 692 -179 306 -274 455 -601 935 -562 823 -700
996 -1763 2213 l-842 962 -10 -62 -10 -62 -42 49 c-38 45 -43 55 -43 102 0 51
-1 53 -129 210 -548 676 -1058 1374 -1916 2623 -153 223 -355 513 -450 645
-236 331 -276 397 -345 572 -57 146 -59 155 -68 284 l-10 134 57 103 c48 90
69 116 151 192 83 77 110 94 199 134 58 26 162 62 233 81 123 34 136 35 298
35 265 0 333 -14 678 -136 161 -57 296 -104 301 -104 4 0 17 14 29 30 20 26
29 30 71 30 62 0 103 28 143 97 l29 52 -128 64 c-557 280 -1000 428 -1468 492
-136 19 -488 27 -615 14z m615 -160 c130 -16 411 -72 422 -82 2 -2 -41 -7 -94
-10 -97 -5 -304 -43 -504 -91 -177 -43 -356 -151 -446 -270 -165 -218 -198
-509 -92 -816 66 -192 170 -369 428 -728 97 -136 291 -413 431 -617 838 -1222
1337 -1907 1878 -2580 80 -99 149 -185 154 -191 5 -7 2 -163 -7 -374 -8 -199
-15 -387 -15 -418 0 -36 -3 -53 -10 -46 -5 5 -664 963 -1465 2129 -800 1166
-1473 2140 -1494 2165 -90 106 -195 153 -440 195 -85 14 -175 33 -200 42 -25
8 -101 50 -167 94 -155 101 -244 143 -303 143 -41 0 -74 -16 -314 -152 -293
-168 -297 -171 -297 -262 0 -60 42 -175 100 -270 l39 -65 -33 -30 c-19 -16
-76 -66 -127 -110 -52 -43 -157 -140 -235 -215 -78 -74 -155 -143 -172 -153
l-31 -18 -39 35 c-22 21 -61 78 -93 138 -31 57 -98 162 -151 233 -52 72 -165
226 -251 343 -86 118 -157 218 -157 222 0 36 137 137 267 196 72 33 498 194
513 194 4 0 28 -32 54 -71 58 -86 120 -155 159 -175 59 -31 94 -22 314 80 114
53 226 107 247 119 97 54 105 148 36 412 -37 140 -44 186 -45 261 0 111 -1
109 142 205 502 337 952 514 1423 559 131 12 395 3 575 -21z m3270 -6594 c925
-1058 1110 -1293 1650 -2085 321 -471 412 -613 600 -935 121 -209 293 -522
381 -695 108 -212 201 -378 285 -509 114 -179 138 -210 307 -389 275 -293 357
-431 322 -538 -19 -57 -110 -146 -325 -319 -230 -184 -417 -296 -619 -369 -71
-25 -139 -46 -152 -46 -12 0 -56 7 -96 15 -65 14 -77 20 -110 58 -45 53 -52
88 -49 277 3 166 -17 344 -55 494 -24 94 -34 114 -169 330 -78 127 -198 328
-265 446 -190 335 -716 1088 -1325 1895 -340 452 -571 777 -940 1325 -87 129
-200 294 -251 365 l-92 130 33 230 c19 127 55 424 80 660 51 487 53 501 65
489 4 -5 331 -378 725 -829z"
                              />
                              <path
                                d="M6524 6006 c-46 -46 -44 -74 15 -176 43 -76 2685 -4061 2729 -4119
l19 -24 43 46 c80 88 179 137 324 163 44 8 81 16 84 19 4 3 -2871 3880 -2990
4031 -79 101 -161 123 -224 60z"
                              />
                              <path
                                d="M9557 1593 c-2 -2 8 -56 24 -121 15 -64 41 -179 59 -254 l32 -138 38
-11 39 -12 123 88 c68 49 124 89 125 90 1 0 5 19 8 41 l7 40 -183 134 c-146
107 -191 135 -226 140 -23 4 -44 5 -46 3z"
                              />
                            </g>
                          </svg>
                        </span>

                        <div className="ml-4">
                          <h2 className="text-lg font-bold">Demobe Tab</h2>

                          <p className="mt-1 text-sm text-black">
                            This is still in development and will be the last
                            implementation of the DHCP tool.
                          </p>
                        </div>
                      </div> */}
                      </div>
                    </div>
                  </section>
                  <section className="text-black bg-white ml-6">
                    <div className="container px-5 mx-auto">
                      <div className="flex flex-wrap w-full  flex-col items-center text-center"></div>
                      <div className="flex flex-wrap -m-4">
                        <div className="p-4 lg:w-1/3">
                          <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                            <img
                              className="object-scale-down h-12 w-96 mt-3"
                              src={Add}
                              alt="blog"
                            />
                            <div className="p-6">
                              <h2 className="tracking-widest text-lg title-font font-medium text-green-700 mb-1">
                                Add / Create Button
                              </h2>

                              <p className="leading-relaxed mb-3 mt-2">
                                This can be used if there is an active / valid
                                lease for the device you are trying to reserve.
                                If there is an active lease that does not
                                already have a reservation you will see this
                                button next to the active lease that you can
                                click to bring up the pre-filled form with the
                                selected lease information. Next to the search
                                box you will see this same button, this will be
                                used if there is no active lease or any other
                                reason to manually add a reservation.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 lg:w-1/3">
                          <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                            <img
                              className="object-scale-down h-12 w-96 mt-3"
                              src={Edit}
                              alt="blog"
                            />
                            <div className="p-6">
                              <h2 className="tracking-widest text-lg title-font font-medium text-blue-500 mb-1">
                                Edit Button
                              </h2>

                              <p className="leading-relaxed mb-3">
                                This can be used to edit an active reservation's
                                description. If there is no active reservation
                                you will not be able to edit the description.
                                Clicking this will bring up the pre-filled form
                                with the selected reservation information. All
                                you will need to do is edit the description
                                field. You can edit the description in either
                                the "Create / Edit Reservations" tab or the
                                "Reservation Lookup" tab.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 lg:w-1/3">
                          <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                            <img
                              className="object-scale-down h-12 w-96 mt-3"
                              src={Del}
                              alt="blog"
                            />
                            <div className="p-6">
                              <h2 className="tracking-widest text-lg title-font font-medium text-red-600 mb-1">
                                Delete Button
                              </h2>

                              <p className="leading-relaxed mb-3">
                                This can be used to delete an active
                                reservation. Clicking this will bring up the
                                pre-filled form with the selected reservation
                                information. All you will need to do is click
                                the delete button at the bottom of the form. You
                                can delete the reservation in either the "Create
                                / Edit Reservations" tab or the "Reservation
                                Lookup" tab.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </TabPanel>
              </TabPanels>
            </Tabs>
            <ProfileContent />
          </AuthenticatedTemplate>
          <UnauthenticatedTemplate>
            <Box textAlign="center" py={10} px={6} mt={300}>
              <InfoIcon boxSize={"50px"} color={"blue.500"} />
              <Heading as="h2" size="xl" mt={6} mb={2}>
                You are not signed in!
              </Heading>
              <Text color={"gray.500"}>
                You are not signed in! Please sign in to use the DHCP Tool.
              </Text>
            </Box>
          </UnauthenticatedTemplate>
        </PageLayout>
      </ChakraProvider>
    </NextUIProvider>
  );
}

function ProfileContent() {
  const { instance, accounts } = useMsal();
  const [graphData, setGraphData] = useState(null);
  const [dhcpData, setDhcpData] = useState(null);

  const name = accounts[0] && accounts[0].name;

  function RequestProfileData() {
    const request = {
      ...loginRequest,
      account: accounts[0],
    };

    // Silently acquires an access token which is then attached to a request for Microsoft Graph data
    instance
      .acquireTokenSilent(request)
      .then((response) => {
        callMsGraph(response.accessToken).then((response) =>
          setGraphData(response)
        );
      })
      .catch((e) => {
        instance.acquireTokenPopup(request).then((response) => {
          callMsGraph(response.accessToken).then((response) =>
            setGraphData(response)
          );
        });
      });
  }

  function RequestDhcpData() {
    const request = {
      ...loginRequest,
      account: accounts[0],
    };

    // Silently acquires an access token which is then attached to a request for Microsoft Graph data
    instance
      .acquireTokenSilent(request)
      .then((response) => {
        callDHCP(response.accessToken).then((response) =>
          setDhcpData(response)
        );
      })
      .catch((e) => {
        instance.acquireTokenPopup(request).then((response) => {
          callDHCP(response.accessToken).then((response) =>
            setDhcpData(response)
          );
        });
      });
  }

  return (
    <>
      <Box textAlign="left" px={6}>
        <Heading as="h2" size="lg" mt={0} mb={125}></Heading>
      </Box>
      {/* {graphData ? (
        <ProfileData graphData={graphData} dhcpData={dhcpData} />
      ) : (
        <Button
          variant="secondary"
          onClick={() => {
            RequestProfileData();
            RequestDhcpData();
          }}
        >
          Request Profile Information
        </Button>
      )} */}
    </>
  );
}

export default App;
