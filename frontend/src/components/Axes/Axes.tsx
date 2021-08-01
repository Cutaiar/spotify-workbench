import React from "react";
import "./Axes.css"
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

interface IAxesProps {
    setAxisChange: (b: boolean) => void;
    axisChange: boolean;
    marginTop: any //type this ass css thingy to lazy to do for now tho
}

export const Axis = (props: IAxesProps) => {
    const {setAxisChange, marginTop, axisChange} = props
    const classes = useStyles();


    const onAxisChange = () => {
        setAxisChange(!axisChange)

    }


    return <div style={{ marginTop: marginTop }} className={"axis-style"}>
        <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Tempo</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={"Tempo"}
                onChange={onAxisChange}
            >
                <MenuItem value={"Tempo"}>X</MenuItem>
                <MenuItem value={"Valence"}>Y</MenuItem>
                <MenuItem value={"Loudness"}>Z</MenuItem>
            </Select>
        </FormControl>
    </div>
}