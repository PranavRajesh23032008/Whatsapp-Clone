import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

function Progress(props) {

    return (

        <div
            className={"bg-white text-center shadow-2xl"}
            style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translateX(-50%) translateY(-50%)",
                borderRadius: "5px",
                padding: "5vh",
                borderRadius: 10
            }}
        >
            <title>Loading...</title>
            <img
                className={"cursor-pointer object-contain  h-52 w-52 mb-10"}
                src="http://www.heretailshop.com/image/catalog/598px-WhatsApp.svg.png"
            /> <CircularProgress
                size={50}
                thickness={4}
                style={{ color: "#25D366", marginBottom: "5px" }} className={"w-52 focus:outline-none"}
            />
        </div>
    );
}


export default Progress

