import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import initilization from "../../../utils/init";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
const idObject = JSON.parse('[]');
const idOptions = Object.entries(idObject).map((x,i) => ({ name: x[1], value: x[0] }));

const getSchemaValidationErrorsStrings = (errorObj) => {
    let errMsg = {};
    for (const key in errorObj.errors) {
      if (Object.hasOwnProperty.call(errorObj.errors, key)) {
        const element = errorObj.errors[key];
        if (element?.message) {
          errMsg[key] = element.message;
        }
      }
    }
    return errMsg.length ? errMsg : errorObj.message ? { error : errorObj.message} : {};
};

const CartitemhistoryCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [voucherid, setVoucherid] = useState([])
const [userid, setUserid] = useState([])

    useEffect(() => {
        let init  = {};
        if (!_.isEmpty(props?.entity)) {
            init = initilization({ ...props?.entity, ...init }, [voucherid,userid], setError);
        }
        set_entity({...init});
        setError({});
    }, [props.show]);

    const validate = () => {
        let ret = true;
        const error = {};
        
        if (!ret) setError(error);
        return ret;
    }

    const onSave = async () => {
        if(!validate()) return;
        let _data = {
            id: _entity?.id,voucherid: _entity?.voucherid?._id,userid: _entity?.userid?._id,quantity: _entity?.quantity,completeddate: _entity?.completeddate,
            createdBy: props.user._id,
            updatedBy: props.user._id
        };

        setLoading(true);

        try {
            
        const result = await client.service("cartitemhistory").create(_data);
        const eagerResult = await client
            .service("cartitemhistory")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[result._id]}, $populate : [
                {
                    path : "voucherid",
                    service : "voucher",
                    select:["categoryid"]},{
                    path : "userid",
                    service : "users",
                    select:["name"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Create info", message: "Info Cartitemhistory updated successfully" });
        props.onCreateResult(eagerResult.data[0]);
        } catch (error) {
            console.log("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
            props.alert({ type: "error", title: "Create", message: "Failed to create in Cartitemhistory" });
        }
        setLoading(false);
    };

    

    

    useEffect(() => {
                    // on mount voucher
                    client
                        .service("voucher")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleVoucherId } })
                        .then((res) => {
                            setVoucherid(res.data.map((e) => { return { name: e['categoryid'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "Voucher", type: "error", message: error.message || "Failed get voucher" });
                        });
                }, []);

useEffect(() => {
                    // on mount users
                    client
                        .service("users")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleUsersId } })
                        .then((res) => {
                            setUserid(res.data.map((e) => { return { name: e['name'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "Users", type: "error", message: error.message || "Failed get users" });
                        });
                }, []);

    const renderFooter = () => (
        <div className="flex justify-content-end">
            <Button label="save" className="p-button-text no-focus-effect" onClick={onSave} loading={loading} />
            <Button label="close" className="p-button-text no-focus-effect p-button-secondary" onClick={props.onHide} />
        </div>
    );

    const setValByKey = (key, val) => {
        let new_entity = { ..._entity, [key]: val };
        set_entity(new_entity);
        setError({});
    };

    const voucheridOptions = voucherid.map((elem) => ({ name: elem.name, value: elem.value }));
const useridOptions = userid.map((elem) => ({ name: elem.name, value: elem.value }));

    return (
        <Dialog header="Create Cartitemhistory" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max scalein animation-ease-in-out animation-duration-1000" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="cartitemhistory-create-dialog-component">
            <div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="id">Id:</label>
                <Dropdown id="id" value={_entity?.id} options={idOptions} optionLabel="name" optionValue="value" onChange={(e) => setValByKey("id", e.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["id"]) ? (
              <p className="m-0" key="error-id">
                {error["id"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="voucherid">Voucherid:</label>
                <Dropdown id="voucherid" value={_entity?.voucherid?._id} optionLabel="name" optionValue="value" options={voucheridOptions} onChange={(e) => setValByKey("voucherid", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["voucherid"]) ? (
              <p className="m-0" key="error-voucherid">
                {error["voucherid"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="userid">Userid:</label>
                <Dropdown id="userid" value={_entity?.userid?._id} optionLabel="name" optionValue="value" options={useridOptions} onChange={(e) => setValByKey("userid", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["userid"]) ? (
              <p className="m-0" key="error-userid">
                {error["userid"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="quantity">Quantity:</label>
                <InputNumber id="quantity" value={_entity?.quantity} min={0} max={100} onChange={ (e) => setValByKey("quantity", e.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["quantity"]) ? (
              <p className="m-0" key="error-quantity">
                {error["quantity"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="completeddate">Completeddate:</label>
                <Calendar id="completeddate" value={_entity?.completeddate ? new Date(_entity?.completeddate) : null} onChange={ (e) => setValByKey("completeddate", e.value)} showTime hourFormat="12"  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["completeddate"]) ? (
              <p className="m-0" key="error-completeddate">
                {error["completeddate"]}
              </p>
            ) : null}
          </small>
            </div>
            <small className="p-error">
                {Array.isArray(Object.keys(error))
                ? Object.keys(error).map((e, i) => (
                    <p className="m-0" key={i}>
                        {e}: {error[e]}
                    </p>
                    ))
                : error}
            </small>
            </div>
        </Dialog>
    );
};

const mapState = (state) => {
    const { user } = state.auth;
    return { user };
};
const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(CartitemhistoryCreateDialogComponent);
