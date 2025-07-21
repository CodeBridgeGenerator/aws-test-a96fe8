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
import { InputTextarea } from "primereact/inputtextarea";


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

const VoucherCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [categoryid, setCategoryid] = useState([])

    useEffect(() => {
        let init  = {};
        if (!_.isEmpty(props?.entity)) {
            init = initilization({ ...props?.entity, ...init }, [categoryid], setError);
        }
        set_entity({...init});
        setError({});
    }, [props.show]);

    const validate = () => {
        let ret = true;
        const error = {};
          
            if (_.isEmpty(_entity?.id)) {
                error["id"] = `Id field is required`;
                ret = false;
            }
  
            if (_.isEmpty(_entity?.points)) {
                error["points"] = `Points field is required`;
                ret = false;
            }
  
            if (_.isEmpty(_entity?.title)) {
                error["title"] = `Title field is required`;
                ret = false;
            }
  
            if (_.isEmpty(_entity?.description)) {
                error["description"] = `Description field is required`;
                ret = false;
            }
        if (!ret) setError(error);
        return ret;
    }

    const onSave = async () => {
        if(!validate()) return;
        let _data = {
            id: _entity?.id,categoryid: _entity?.categoryid?._id,points: _entity?.points,title: _entity?.title,image: _entity?.image,description: _entity?.description,Termsandcondition: _entity?.Termsandcondition,
            createdBy: props.user._id,
            updatedBy: props.user._id
        };

        setLoading(true);

        try {
            
        const result = await client.service("voucher").create(_data);
        const eagerResult = await client
            .service("voucher")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[result._id]}, $populate : [
                {
                    path : "categoryid",
                    service : "category",
                    select:["id"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Create info", message: "Info Voucher updated successfully" });
        props.onCreateResult(eagerResult.data[0]);
        } catch (error) {
            console.log("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
            props.alert({ type: "error", title: "Create", message: "Failed to create in Voucher" });
        }
        setLoading(false);
    };

    

    

    useEffect(() => {
                    // on mount category
                    client
                        .service("category")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleCategoryId } })
                        .then((res) => {
                            setCategoryid(res.data.map((e) => { return { name: e['id'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "Category", type: "error", message: error.message || "Failed get category" });
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

    const categoryidOptions = categoryid.map((elem) => ({ name: elem.name, value: elem.value }));

    return (
        <Dialog header="Create Voucher" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max scalein animation-ease-in-out animation-duration-1000" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="voucher-create-dialog-component">
            <div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="id">Id:</label>
                <InputText id="id" className="w-full mb-3 p-inputtext-sm" value={_entity?.id} onChange={(e) => setValByKey("id", e.target.value)}  required  />
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
                <label htmlFor="categoryid">Categoryid:</label>
                <Dropdown id="categoryid" value={_entity?.categoryid?._id} optionLabel="name" optionValue="value" options={categoryidOptions} onChange={(e) => setValByKey("categoryid", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["categoryid"]) ? (
              <p className="m-0" key="error-categoryid">
                {error["categoryid"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="points">Points:</label>
                <InputText id="points" className="w-full mb-3 p-inputtext-sm" value={_entity?.points} onChange={(e) => setValByKey("points", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["points"]) ? (
              <p className="m-0" key="error-points">
                {error["points"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="title">Title:</label>
                <InputText id="title" className="w-full mb-3 p-inputtext-sm" value={_entity?.title} onChange={(e) => setValByKey("title", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["title"]) ? (
              <p className="m-0" key="error-title">
                {error["title"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="image">Image:</label>
                <InputText className="w-full mb-3 p-inputtext-sm" value={_entity?.image} onChange={(e) => setValByKey("image", e.target.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["image"]) ? (
              <p className="m-0" key="error-image">
                {error["image"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="description">Description:</label>
                <InputText id="description" className="w-full mb-3 p-inputtext-sm" value={_entity?.description} onChange={(e) => setValByKey("description", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["description"]) ? (
              <p className="m-0" key="error-description">
                {error["description"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="Termsandcondition">Termsandcondition:</label>
                <InputTextarea id="Termsandcondition" rows={5} cols={30} value={_entity?.Termsandcondition} onChange={ (e) => setValByKey("Termsandcondition", e.target.value)} autoResize  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["Termsandcondition"]) ? (
              <p className="m-0" key="error-Termsandcondition">
                {error["Termsandcondition"]}
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

export default connect(mapState, mapDispatch)(VoucherCreateDialogComponent);
