import { assets } from "../assets/assets";
import { motion } from "framer-motion";

const Footer = () => {
    const linkSections = [
        {
            title: "Quick Links",
            links: ["Home", "Browse cars", "List your car", "Contact Us"]
        },
        {
            title: "Need Help?",
            links: ["Help center", "Return & Refund Policy", "Payment Methods", "Terms and conditions"]
        },
        {
            title: "Follow Us",
            links: ["Instagram", "Twitter", "Facebook"]
        }
    ];

    return (
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} transition={{duration:0.6}} viewport={{once:true}} className="py-6 px-6 md:px-16 lg:px-24 xl:px-32">
            <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-500">
                <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} transition={{duration:0.7,delay:0.1}} viewport={{once:true}}>
                    <img className="w-34 md:w-32" src={assets.logo} alt="dummyLogoColored" />
                    <p className="max-w-[410px] mt-6 text-2xl font-semibold">"From city streets to scenic highways, we've got the perfect ride for you."</p>
                </motion.div>
                <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
                    {linkSections.map((section, index) => (
                        <motion.div key={index} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} transition={{duration:0.6,delay:0.2*index}} viewport={{once:true}}>
                            <h3 className="font-semibold text-base text-gray-900 md:mb-5 mb-2">{section.title}</h3>
                            <ul className="text-sm space-y-1">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <a href="/" className="hover:underline transition">{link}</a>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
            <p className="py-4 text-center text-sm md:text-base text-gray-500/80">
                Copyright 2025 © <a href="/">CarRental</a> All Right Reserved.
            </p>
        </motion.div>
    );
};
export default Footer;
