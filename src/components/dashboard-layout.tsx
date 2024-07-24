import React from "react";
import styles from '../app/home.module.css'

export default function DashboardLayout({vis1, vis2, vis3}: {
  vis1: React.ReactElement,
  vis2: React.ReactElement,
  vis3: React.ReactElement
})
{
    return (
        <div>
            <div className={styles.topView}>
                <div className={styles.topVis}>{vis1}</div>
            </div>
            <div className={styles.bottomView}>
                <div className={styles.bottomVis}>{vis2}</div>
                <div className={styles.bottomVis}>{vis3}</div>
            </div>
        </div>
    );
}
