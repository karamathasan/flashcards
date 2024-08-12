import { useState } from "react";
import { motion } from "framer-motion";

const Flashcard = (props) => {
    const [isFlipped, setIsFlipped] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)

    const handleFlip = () => {
        setIsAnimating(true)
        setIsFlipped(!isFlipped)
    }

    return (
        <div className="h-[20rem] w-[25rem]" >
            <div
                className="flip-card w-full h-full"
                onClick={handleFlip}
            >
                <motion.div
                    className="flip-card-inner w-[100%] h-[100%]"
                    initial={false}
                    animate={{ rotateX: isFlipped ? 180 : 360 }}
                    transition={{ duration: 0.3, animationDirection: "normal" }}
                    onAnimationComplete={() => setIsAnimating(false)}
                >
                    <div className="flip-card-front w-full h-full p-4 flex justify-center items-center rounded-[25px] shadow-xl text-[35px]">
                        {props.front}
                    </div>

                    <div className="flip-card-back w-full h-full p-4 flex justify-center items-center rounded-[25px] shadow-xl text-[22px]">
                        {props.back}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default Flashcard