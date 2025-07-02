import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import {useAppDispatch, useAppSelector} from "../../stores/hooks";
import {useRouter} from "next/router";
import { fetch } from '../../stores/users/usersSlice'
import dataFormatter from '../../helpers/dataFormatter';
import LayoutAuthenticated from "../../layouts/Authenticated";
import {getPageTitle} from "../../config";
import SectionTitleLineWithButton from "../../components/SectionTitleLineWithButton";
import SectionMain from "../../components/SectionMain";
import CardBox from "../../components/CardBox";
import BaseButton from "../../components/BaseButton";
import BaseDivider from "../../components/BaseDivider";
import {mdiChartTimelineVariant} from "@mdi/js";
import {SwitchField} from "../../components/SwitchField";
import FormField from "../../components/FormField";

const UsersView = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { users } = useAppSelector((state) => state.users)

    const { id } = router.query;

    function removeLastCharacter(str) {
      console.log(str,`str`)
      return str.slice(0, -1);
    }

    useEffect(() => {
        dispatch(fetch({ id }));
    }, [dispatch, id]);

    return (
      <>
          <Head>
              <title>{getPageTitle('View users')}</title>
          </Head>
          <SectionMain>
            <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={removeLastCharacter('View users')} main>
                <BaseButton
                  color='info'
                  label='Edit'
                  href={`/users/users-edit/?id=${id}`}
                />
            </SectionTitleLineWithButton>
            <CardBox>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>First Name</p>
                    <p>{users?.firstName}</p>
                </div>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>Last Name</p>
                    <p>{users?.lastName}</p>
                </div>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>Phone Number</p>
                    <p>{users?.phoneNumber}</p>
                </div>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>E-Mail</p>
                    <p>{users?.email}</p>
                </div>

                <FormField label='Disabled'>
                    <SwitchField
                      field={{name: 'disabled', value: users?.disabled}}
                      form={{setFieldValue: () => null}}
                      disabled
                    />
                </FormField>

                <>
                    <p className={'block font-bold mb-2'}>Audits Auditor</p>
                    <CardBox
                      className='mb-6 border border-gray-300 rounded overflow-hidden'
                      hasTable
                    >
                        <div className='overflow-x-auto'>
                            <table>
                            <thead>
                            <tr>

                                <th>AuditTitle</th>

                                <th>AuditDate</th>

                                <th>Findings</th>

                            </tr>
                            </thead>
                            <tbody>
                            {users.audits_auditor && Array.isArray(users.audits_auditor) &&
                              users.audits_auditor.map((item: any) => (
                                <tr key={item.id} onClick={() => router.push(`/audits/audits-view/?id=${item.id}`)}>

                                    <td data-label="audit_title">
                                        { item.audit_title }
                                    </td>

                                    <td data-label="audit_date">
                                        { dataFormatter.dateTimeFormatter(item.audit_date) }
                                    </td>

                                    <td data-label="findings">
                                        { item.findings }
                                    </td>

                                </tr>
                              ))}
                            </tbody>
                        </table>
                        </div>
                        {!users?.audits_auditor?.length && <div className={'text-center py-4'}>No data</div>}
                    </CardBox>
                </>

                <>
                    <p className={'block font-bold mb-2'}>Inspections ConductedBy</p>
                    <CardBox
                      className='mb-6 border border-gray-300 rounded overflow-hidden'
                      hasTable
                    >
                        <div className='overflow-x-auto'>
                            <table>
                            <thead>
                            <tr>

                                <th>InspectionType</th>

                                <th>InspectionDate</th>

                                <th>Remarks</th>

                            </tr>
                            </thead>
                            <tbody>
                            {users.inspections_conducted_by && Array.isArray(users.inspections_conducted_by) &&
                              users.inspections_conducted_by.map((item: any) => (
                                <tr key={item.id} onClick={() => router.push(`/inspections/inspections-view/?id=${item.id}`)}>

                                    <td data-label="inspection_type">
                                        { item.inspection_type }
                                    </td>

                                    <td data-label="inspection_date">
                                        { dataFormatter.dateTimeFormatter(item.inspection_date) }
                                    </td>

                                    <td data-label="remarks">
                                        { item.remarks }
                                    </td>

                                </tr>
                              ))}
                            </tbody>
                        </table>
                        </div>
                        {!users?.inspections_conducted_by?.length && <div className={'text-center py-4'}>No data</div>}
                    </CardBox>
                </>

                <>
                    <p className={'block font-bold mb-2'}>Risk_managements AssignedTo</p>
                    <CardBox
                      className='mb-6 border border-gray-300 rounded overflow-hidden'
                      hasTable
                    >
                        <div className='overflow-x-auto'>
                            <table>
                            <thead>
                            <tr>

                                <th>Title</th>

                                <th>Description</th>

                                <th>DueDate</th>

                            </tr>
                            </thead>
                            <tbody>
                            {users.risk_managements_assigned_to && Array.isArray(users.risk_managements_assigned_to) &&
                              users.risk_managements_assigned_to.map((item: any) => (
                                <tr key={item.id} onClick={() => router.push(`/risk_managements/risk_managements-view/?id=${item.id}`)}>

                                    <td data-label="title">
                                        { item.title }
                                    </td>

                                    <td data-label="description">
                                        { item.description }
                                    </td>

                                    <td data-label="due_date">
                                        { dataFormatter.dateTimeFormatter(item.due_date) }
                                    </td>

                                </tr>
                              ))}
                            </tbody>
                        </table>
                        </div>
                        {!users?.risk_managements_assigned_to?.length && <div className={'text-center py-4'}>No data</div>}
                    </CardBox>
                </>

                <>
                    <p className={'block font-bold mb-2'}>Safety_tickets ReportedBy</p>
                    <CardBox
                      className='mb-6 border border-gray-300 rounded overflow-hidden'
                      hasTable
                    >
                        <div className='overflow-x-auto'>
                            <table>
                            <thead>
                            <tr>

                                <th>Title</th>

                                <th>Description</th>

                                <th>ReportedDate</th>

                            </tr>
                            </thead>
                            <tbody>
                            {users.safety_tickets_reported_by && Array.isArray(users.safety_tickets_reported_by) &&
                              users.safety_tickets_reported_by.map((item: any) => (
                                <tr key={item.id} onClick={() => router.push(`/safety_tickets/safety_tickets-view/?id=${item.id}`)}>

                                    <td data-label="title">
                                        { item.title }
                                    </td>

                                    <td data-label="description">
                                        { item.description }
                                    </td>

                                    <td data-label="reported_date">
                                        { dataFormatter.dateTimeFormatter(item.reported_date) }
                                    </td>

                                </tr>
                              ))}
                            </tbody>
                        </table>
                        </div>
                        {!users?.safety_tickets_reported_by?.length && <div className={'text-center py-4'}>No data</div>}
                    </CardBox>
                </>

                <BaseDivider />

                <BaseButton
                    color='info'
                    label='Back'
                    onClick={() => router.push('/users/users-list')}
                />
              </CardBox>
          </SectionMain>
      </>
    );
};

UsersView.getLayout = function getLayout(page: ReactElement) {
    return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
    )
}

export default UsersView;
