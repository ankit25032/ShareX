import React, { useEffect, useState } from "react";
import { BsDownload } from "react-icons/bs";
import { FileIcon, defaultStyles } from "react-file-icon";
export default function File({ blob }) {
  return (
    <div className="incoming file-incoming">
      {/* <FileIcon
        className="file-icon-incoming"
        extension={
          data &&
          data.name.substring(data.name.lastIndexOf(".") + 1, data.name.length)
        }
        {...defaultStyles.docx}
      />
      <p>
        {data &&
          data.name.substring(0, 12) +
            "..." +
            data.name.substring(
              data.name.lastIndexOf(".") + 1,
              data.name.length
            )}
      </p> */}
      <div className="download-btn">
        <a download={"ankit.jpg"} href={blob}>
          <BsDownload />
        </a>

        {/* <p>{data && (data.size / 1e6).toPrecision(1) + "MB"}</p> */}
      </div>
    </div>
  );
}
