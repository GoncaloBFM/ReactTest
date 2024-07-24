import React from 'react';
import { PlottingData } from '@/hooks/usePlottingData';
import { Button } from '@mui/material';

type Props = {
    data: PlottingData,
    filterData: () => void,
};

export function Plot(props: Props) {
    return (
        <div>
            <div>I am a plot</div>
            <pre>
                {props.data.map(d => `${d}\n`)}
            </pre>
            <Button onClick={() => props.filterData()}>Update</Button>
        </div>
    );
}
