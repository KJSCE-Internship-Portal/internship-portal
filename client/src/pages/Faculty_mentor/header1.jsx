import React, { useState } from "react";
import { Button, Img, Line, List, Text } from "components";
import Sidebar from "/Users/siddharthsingh/Downloads/temp_page/src/pages/Page/sidebar.jsx";

export default function Header1() {
return(
<header className="bg-white-A700 flex flex-col items-center justify-center md:px-5 shadow-bs w-full">
<div className="flex md:flex-col flex-row md:gap-10 items-center justify-between p-1 w-full">
  <div className="h-10 md:h-8 ml-4 md:ml-[0] md:mt-0 mt-2 relative w-[22%] md:w-full">
  
    <div className="absolute flex flex-row gap-3 items-center justify-between right-[0] top-[0] w-[86%]">
        
      <div className="flex flex-col h-8 items-center justify-start w-8">
        <Img
          className="h-8 md:h-auto object-cover w-8"
          src="images/img_vector.png"
          alt="vector"
        />
      </div>
      <div className="flex flex-col items-start justify-start pr-[3px] pt-[3px]">
        <Text
          className="text-blue_gray-900 text-xl"
          size="txtRobotoSemiBold20"
        >
          Internship Platform
        </Text>
      </div>
    </div>
    <Img
      className="absolute bottom-[0] h-8 left-[0]"
      src="images/img_frame.svg"
      alt="frame"
    />
  </div>
  <div className="md:h-[23px] h-[31px] mr-5 relative w-[46%] md:w-full">
    <div className="absolute bottom-[0] flex flex-col inset-x-[0] items-end justify-start mx-auto md:pl-10 sm:pl-5 pl-[489px] w-full">
      <div className="flex flex-col items-start justify-start w-full">
        <div className="flex flex-row gap-2 items-center justify-start md:ml-[0] ml-[15px] w-auto">
          <Img
            className="h-[19px] md:h-auto object-cover w-[18px]"
            src="images/img_icon_19x18.png"
            alt="icon_One"
          />
        </div>
      </div>
    </div>
  </div>
</div>
</header>
    );
};

