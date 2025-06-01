import './GroupRole.scss';
import { useState, useEffect } from 'react';
import { fetchGroups } from '../../services/userService'
import { toast } from 'react-toastify';
import { fetchAllRole, fetchRolesByGroup, assignRolesToGroup } from '../../services/roleService';
import _ from 'lodash';

const GroupRole = () => {
    const [userGroups, setUSerGroups] = useState([]);
    const [selectGroup, setSelectGroup] = useState("");
    const [listRoles, setListRoles] = useState([]);
    const [assignRolesByGroup, setAssignRolesByGroup] = useState([]);

    useEffect(() => {
        getGroups();
        getAllRoles();
    }, [])

    const getGroups = async () => {
        let res = await fetchGroups();
        if (res && +res.EC === 0) {
            setUSerGroups(res.DT);
        }
        else {
            toast.error(res.EM);
        }
    }

    const getAllRoles = async () => {
        let data = await fetchAllRole();
        if (data && +data.EC === 0) {
            setListRoles(data.DT);
        }
    }

    const handleOnChangeGroup = async (value) => {
        setSelectGroup(value);
        if (value) {
            let data = await fetchRolesByGroup(value);
            if (data && +data.EC === 0) {
                let result = buildDataRolesByGroup(data.DT.Roles, listRoles);
                setAssignRolesByGroup(result);
            }
        }
    }

    const buildDataRolesByGroup = (groupRoles, allRoles) => {
        let result = [];
        if (allRoles && allRoles.length > 0) {
            allRoles.map(role => {
                let object = {};
                object.id = role.id;
                object.description = role.description;
                object.url = role.url;
                object.isAssigned = false;
                if (groupRoles && groupRoles.length > 0) {
                    object.isAssigned = groupRoles.some(item => item.url === object.url);
                }
                result.push(object);
            })
        }
        return result;
    }

    const handleSelectRole = (value) => {
        const _assignRolesByGroup = _.cloneDeep(assignRolesByGroup);
        let foundIndex = _assignRolesByGroup.findIndex(item => +item.id == +value);
        if (foundIndex > -1) {
            _assignRolesByGroup[foundIndex].isAssigned = !_assignRolesByGroup[foundIndex].isAssigned;
        }
        setAssignRolesByGroup(_assignRolesByGroup);
    }

    // data = { groupid: 4, groupRoles: [{}, {}]}
    const buildDataToSave = () => {
        let result = {};
        const _assignRolesByGroup = _.cloneDeep(assignRolesByGroup);
        result.groupId = selectGroup;
        let groupRolesFilter = _assignRolesByGroup.filter(item => item.isAssigned === true);
        let finalGroupRoles = groupRolesFilter.map(item => {
            let data = { groupId: +selectGroup, roleId: +item.id };
            return data;
        })
        // console.log('final group roles: ', finalGroupRoles);
        result.groupRoles = finalGroupRoles;
        return result;
    }

    const handleSave = async () => {
        // console.log("check raw data: ", assignRolesByGroup);
        let data = buildDataToSave();
        // console.log("check send data: ", data);
        let res = await assignRolesToGroup(data);
        if (res && +res.EC === 0) {
            toast.success(res.EM);
        } else {
            toast.error(res.EM);
        }
    }

    return (
        <div className='group-role-container'>
            <div className='container'>
                <div className='container mt-3'>
                    <h4>Group Role</h4>
                    <div className='assign-group-role'>
                        <div className='col-12 col-sm-6 form-group'>
                            <label>Select group:(<span className='red'>*</span>):</label>
                            <select
                                className='form-select'
                                onChange={(event) => handleOnChangeGroup(event.target.value)}>
                                <option value="">Select your group</option>
                                {userGroups.length > 0 && userGroups.map((item, index) => {
                                    return (
                                        <option key={`group-${index}`} value={item.id}>{item.name}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <hr />
                        {selectGroup &&
                            <div className='roles'>
                                <h5>Assign Roles</h5>
                                {
                                    assignRolesByGroup && assignRolesByGroup.length > 0 &&
                                    assignRolesByGroup.map((item, index) => {
                                        return (
                                            <div className="form-check" key={`list-role-${index}`}>
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    value={item.id}
                                                    id={`list-role-${index}`}
                                                    checked={item.isAssigned}
                                                    onChange={(event) => handleSelectRole(event.target.value)} />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor={`list-role-${index}`}>
                                                    {item.url}
                                                </label>
                                            </div>
                                        );
                                    })
                                }
                                <div className='mt-3'>
                                    <button className='btn btn-warning'
                                        onClick={() => handleSave()}
                                    >Save</button>
                                </div>

                            </div>
                        }
                    </div>
                </div>

            </div>
        </div >
    );
}

export default GroupRole;