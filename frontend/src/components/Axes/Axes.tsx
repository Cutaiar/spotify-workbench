import React from "react";
import "./Axes.css"
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { randomFeatures } from "../../models/features";

//afaik i can only get the keys when I have an instance, then setup dropdown options
const featuresInstance = randomFeatures();
const dropdownOptions = [];

Object.keys(featuresInstance).forEach((k) => {
  dropdownOptions.push({ value: k, label: k });
});

interface AxisObject {
    name: string;
    value: string;
}


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
    setAxisChange: (b: AxisObject) => void;
    axisChange: AxisObject;
    axis: string;
    marginTop: any //type this ass css thingy to lazy to do for now tho
}

export const Axis = (props: IAxesProps) => {
    const {setAxisChange, marginTop, axisChange, axis} = props
    const classes = useStyles();


    const onAxisChange = (event) => {
        console.log(event.target.value)
        setAxisChange({
            value: event.target.value,
            name: axis
        });
    }

    const menuOptionsContent = dropdownOptions.map(item => <MenuItem value={item.value}>{item.value}</MenuItem>);


    return <div style={{ marginTop: marginTop }} className={"axis-style"}>
        <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">{axis}</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={"Tempo"}
                onChange={onAxisChange}
            >
                {menuOptionsContent}
            </Select>
        </FormControl>
    </div>
}