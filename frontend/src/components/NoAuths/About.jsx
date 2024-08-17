import React from "react";

function About() {
    return (
        <section className="bg-[#4F5295] w-5/6 mx-auto mt-10 mb-5 2xl:w-4/6 2xl:mt-32 rounded-lg text-white px-7 py-6 font-popins flex flex-col space-y-6 text-center ">
            <h1 className="text-4xl text-center">Welcome to our Taskflow App!</h1>

            <div className="flex flex-col space-y-6 leading-7">
                <section>
                    Taskflow is not just another task management tool; it's a comprehensive solution designed to revolutionize the way you work. Developed as our sem 4 mini project, Taskflow represents the culmination of our dedication to innovation and excellence in software development.
                </section>

                <section>
                    Built as a fullstack MERN application, our backend infrastructure leverages cutting-edge technologies to ensure robustness and security. We harness the power of MongoDB with Mongoose for our database needs, while Express and the Express-Validator library handle server-side operations. Security is paramount, and we employ bcryptJS for secure password storage and json-web-token for authentication. To further bolster security measures, we utilize httpOnly cookies for authentication, safeguarding your data at every step. Regular updates and maintenance are managed seamlessly through the node-cron library, ensuring smooth operation and reliability.
                </section>

                <section>
                    On the frontend, we pride ourselves on delivering a user experience that is both intuitive and visually appealing. Powered by React, Vite, and Tailwind CSS, our interface is designed to optimize usability and enhance productivity. We have carefully curated a selection of complementary libraries to enrich your experience, prioritizing responsiveness to ensure seamless functionality across all devices.
                </section>
            </div>
        </section>
    );
}

export default About;
