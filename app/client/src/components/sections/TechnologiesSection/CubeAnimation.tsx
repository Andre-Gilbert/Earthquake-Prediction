import FastAPI from '@assets/fastapi.svg';
import NextJS from '@assets/nextjs.svg';
import Python from '@assets/python.svg';
import TypeScript from '@assets/typescript.svg';
import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './Technologies.module.scss';

const CubeAnimation = () => {
    return (
        <div className={styles.cubeAnimation}>
            <div className={styles.cube}>
                <div className={styles.cubeContainer}>
                    <motion.div
                        className={styles.cubeShadow}
                        whileInView={{ rotateY: ANIMATION.rotateY }}
                        transition={{
                            repeat: ANIMATION.repeat,
                            duration: ANIMATION.duration,
                            ease: ANIMATION.ease,
                        }}
                    >
                        <div>&nbsp;</div>
                    </motion.div>
                </div>
                <div className={styles.cubeContainer}>
                    <motion.div
                        className={styles.cubeFaces}
                        whileInView={{ rotateY: ANIMATION.rotateY }}
                        transition={{
                            repeat: ANIMATION.repeat,
                            duration: ANIMATION.duration,
                            ease: ANIMATION.ease,
                        }}
                    >
                        <div className={styles.cubeFaceFront}>
                            <Image src={TypeScript} alt="typescript" fill sizes="200" priority />
                        </div>
                        <div className={styles.cubeFaceBack}>
                            <Image src={Python} alt="python" priority sizes="200" fill />
                        </div>
                        <div className={styles.cubeFaceTop}>
                            <div>&nbsp;</div>
                        </div>
                        <div className={styles.cubeFaceBottom}>
                            <div>&nbsp;</div>
                        </div>
                        <div className={styles.cubeFaceLeft}>
                            <Image src={NextJS} alt="nextjs" priority sizes="200" fill />
                        </div>
                        <div className={styles.cubeFaceRight}>
                            <Image src={FastAPI} alt="fastapi" priority sizes="200" fill />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

const ANIMATION = {
    rotateY: 360,
    repeat: Infinity,
    duration: 45,
    ease: 'linear',
};

export default CubeAnimation;
