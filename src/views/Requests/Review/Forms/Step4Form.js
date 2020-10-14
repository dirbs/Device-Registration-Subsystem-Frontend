import React from 'react'
import {Button, Card, CardBody, CardHeader, Col, Form, Row} from "reactstrap";
import i18n from '../../../../i18n';
import StepIndicator from '../../../../components/Sidebar/StepIndicator';
import CommentBox from '../../../../components/CommentSection/CommentBox'
import UserInputReview from '../../../../components/Form/UserInputReview'
import {isEmpty, isNil} from "ramda";
import {getReviewStatus} from "../../../../utilities/helpers";
import ImeiRegistration from "../Sections/ImeiRegistration";
import {IS_AUTOMATE} from "../../../../utilities/constants";

const Step4Form = ({
                     stepsNames,
                     stepIndicator,
                     step4Data,
                     stepsInfo,
                     callPrev,
                     jumpToNext,
                     viewType,
                     reviewStatus,
                     dirty,
                     stepReady,
                     isValid,
                     comments,
                     type,
                     handleSubmit
                   }) => {
  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col className="col-12 col-xl-4 order-xl-12 mt-3">
          <StepIndicator stepsInfo={stepsNames} step={stepIndicator} mode={type}/>
          <CommentBox header={i18n.t('commentBox.header')} comments={type === 'view' ? comments : stepsInfo.step4.comments}/>
        </Col>
        <Col className="col-12 col-xl-8 order-xl-1 mt-3">
          <ImeiRegistration step4Data={step4Data} stepReady={stepReady} viewType={viewType}/>
          {(stepReady && type!=='view') &&
          <Card>
            <CardHeader><b>{i18n.t('reviewStatus')}</b></CardHeader>
            <CardBody>
              {!isEmpty(stepsInfo.step4.prevReviewStatus) &&
              <div className="alert alert-warning">
                <b>{i18n.t('currentStatus')}:</b> {getReviewStatus(stepsInfo.step4.prevReviewStatus)}</div>
              }
              <UserInputReview/>
            </CardBody>
          </Card>
          }
          <div className="stepBtn_container">
            {type === 'view' &&
            <React.Fragment>
              <Button onClick={callPrev} className="btn btn-link btn-next-prev">{i18n.t('previous')}</Button>
              <Button color="primary" onClick={jumpToNext} disabled={isNil(step4Data)}
                      className='btn-next-prev'>{IS_AUTOMATE[0] ? i18n.t('finish') : i18n.t('next')}</Button>
            </React.Fragment>
            }
            {type === 'review' &&
            <React.Fragment>
              <Button type="button" onClick={callPrev}
                      className={viewType === 'deregistration' ? 'btn btn-link btn-next-prev stepBtn--hide' : 'btn btn-link btn-next-prev'}
              >{i18n.t('previous')}</Button>
              <Button color="primary" onClick={jumpToNext}
                      className={(reviewStatus === '' || dirty) ? 'btn-next-prev stepBtn--hide' : 'btn-next-prev stepBtn--show'}
              >{i18n.t('next')}</Button>
              <Button color="primary" type="submit"
                      className={(reviewStatus === '' || dirty) ? 'btn-next-prev stepBtn--show' : 'btn-next-prev stepBtn--hide'}
                      disabled={!isValid && (viewType === 'registration' || !stepReady)}>{i18n.t('next')}
              </Button>
            </React.Fragment>
            }
            {' '}
          </div>
        </Col>
      </Row>
    </Form>
  )}
export default Step4Form