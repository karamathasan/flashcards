import { useState } from "react";
import { easeInOut, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const Dropdown = (props) => {
    const [open, setOpen] = useState(false);
    const toggleMenu = () => { setOpen(!open) }
    const isStringLabel = typeof props.label === "string"

    return (
        <div className="relative inline-block text-left">
            <div>
                <button type="button"
                    className={"inline-flex w-full justify-center items-center gap-x-1.5 rounded-md  px-3 py-2 text-sm font-semibold text-gray-900 " + ((isStringLabel) ? "shadow-sm bg-white ring-1 ring-inset ring-gray-300 hover:bg-gray-50" : "")}
                    id="menu-button"
                    aria-expanded="true"
                    aria-haspopup="true"
                    onClick={toggleMenu}
                >
                    {props.label}
                    {isStringLabel &&
                        <FontAwesomeIcon icon={faChevronDown} />
                    }
                </button>
            </div>
            {open &&
                <motion.div
                    initial={{
                        opacity: 0, scale: "95%"
                    }}
                    animate={{
                        opacity: 100, scale: "100%"
                    }}
                    transition={easeInOut}
                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                    tabIndex="-1"
                >
                    <div className="py-1" role="none">
                        {props.children}
                    </div>
                </motion.div>
            }
        </div>
    )
}

export default Dropdown;