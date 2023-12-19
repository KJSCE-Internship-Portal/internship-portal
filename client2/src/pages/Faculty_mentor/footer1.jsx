import React, { useState } from "react";
import { Text } from "components";

export default function Footer1 (){
    return(
<div className="bg-blue_gray-900 flex flex-col items-center justify-start mt-[41px] w-full">
          <div className="flex flex-col items-center justify-start p-4 w-full">
            <div className="flex sm:flex-col flex-row md:gap-10 items-center justify-between max-w-[1232px] mx-auto md:px-5 w-full">
              <div className="flex sm:flex-1 flex-col gap-2 items-center justify-start w-[33%] sm:w-full">
                <div className="flex flex-col items-start justify-start pr-[3px] pt-[3px] w-full">
                  <Text
                    className="text-white-A700 text-xl"
                    size="txtRobotoSemiBold20WhiteA700"
                  >
                    Internship Platform
                  </Text>
                </div>
                <div className="flex flex-col font-inter items-center justify-start pt-[3px] w-full">
                  <Text
                    className="text-base text-white-A700"
                    size="txtInterRegular16"
                  >
                    Empowering students to succeed in their internships.
                  </Text>
                </div>
              </div>
              <div className="flex sm:flex-1 flex-col gap-2 items-center justify-start w-[9%] sm:w-full">
                <div className="flex flex-col items-start justify-start pr-0.5 py-0.5 w-full">
                  <Text
                    className="text-lg text-white-A700"
                    size="txtRobotoSemiBold18"
                  >
                    Resources
                  </Text>
                </div>
                <div className="flex flex-col font-inter items-center justify-start w-full">
                  <div className="flex flex-col items-start justify-start pr-0.5 py-0.5 w-full">
                    <div className="flex flex-col items-center justify-start">
                      <a
                        href="javascript:"
                        className="text-base text-white-A700"
                      >
                        <Text size="txtInterRegular16">Contact Us</Text>
                      </a>
                    </div>
                  </div>
                  <div className="flex flex-col items-start justify-start pr-0.5 py-0.5 w-full">
                    <div className="flex flex-col items-center justify-start">
                      <Text
                        className="text-base text-white-A700"
                        size="txtInterRegular16"
                      >
                        FAQ
                      </Text>
                    </div>
                  </div>
                  <div className="flex flex-col items-start justify-start pr-0.5 py-0.5 w-full">
                    <div className="flex flex-col items-center justify-start">
                      <a
                        href="javascript:"
                        className="text-base text-white-A700"
                      >
                        <Text size="txtInterRegular16">Support</Text>
                      </a>
                    </div>
                  </div>
                  <div className="flex flex-col items-start justify-start pr-0.5 py-0.5 w-full">
                    <div className="flex flex-col items-center justify-start">
                      <a
                        href="javascript:"
                        className="text-base text-white-A700"
                      >
                        <Text size="txtInterRegular16">Privacy Policy</Text>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

);
};
