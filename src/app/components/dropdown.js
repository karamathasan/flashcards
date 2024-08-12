import { useState } from "react";
import { easeInOut, motion } from "framer-motion";


const Dropdown = (props) => {
    const [open, setOpen] = useState(false);
    const toggleMenu = () => { setOpen(!open) }
    const isStringLabel = typeof props.label === "string"

    return (
        <div className="relative inline-block text-left">
            <div>
                <button type="button"
                    className={"inline-flex w-full justify-center gap-x-1.5 rounded-md  px-3 py-2 text-sm font-semibold text-gray-900 " + ((isStringLabel) ? "shadow-sm bg-white ring-1 ring-inset ring-gray-300 hover:bg-gray-50" : "")}
                    id="menu-button"
                    aria-expanded="true"
                    aria-haspopup="true"
                    onClick={toggleMenu}
                >
                    {props.label}
                    {isStringLabel &&
                        <svg className="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                        </svg>
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
                    tabindex="-1"
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