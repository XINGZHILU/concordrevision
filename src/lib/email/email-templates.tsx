import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import React from 'react';
import { deptName } from '@/lib/consts';
import { getYearGroupName } from '@/lib/year-group-config';

function doNotReply() {
  return <p>⚠️ Please <b>do not</b> reply to this email as it is unmanned, but instead <b>contact relevant staff / students</b> directly.</p>;
}

interface ApprovedResourceEmailTemplateProps {
  name: string;
  title: string;
  subject: string;
  year: number;
}

export const ApprovedResourceEmailTemplate: React.FC<Readonly<ApprovedResourceEmailTemplateProps>> = ({
  name, title, subject, year
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6', color: '#333' }}>
    <div style={{ maxWidth: '800px', margin: 'auto', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
      <div style={{ backgroundColor: '#4CAF50', color: 'white', padding: '20px', textAlign: 'center' }}>
        <h1>Resource Approved</h1>
      </div>
      <div style={{ padding: '20px' }}>
        <p>Dear {name},</p>
        <p>Thank you for submitting the test revision material <b>{title}</b> for <b>{getYearGroupName(year)} {subject}</b>. After review from our teachers, we are delighted to inform you that your resource has been <b>accepted ✅</b> and will now be available to be viewed and used on the website. Thank you very much for your hard work and support.</p>
        <br />
        <p>Best regards,</p>
        <p><b>{deptName(subject)}</b></p>
      </div>
      <div style={{ backgroundColor: '#f8f8f8', padding: '15px', textAlign: 'center', fontSize: '12px', color: '#888', borderTop: '1px solid #ddd' }}>
        <p>&copy; {new Date().getFullYear()} Concordpedia. All rights reserved.</p>
      </div>
    </div>
    {doNotReply()}
  </div>
);

interface RejectedResourceEmailTemplateProps {
  name: string;
  title: string;
  subject: string;
  year: number;
}

export const RejectedResourceEmailTemplate: React.FC<Readonly<RejectedResourceEmailTemplateProps>> = ({
  name, title, subject, year
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6', color: '#333' }}>
    <div style={{ maxWidth: '800px', margin: 'auto', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
      <div style={{ backgroundColor: '#F44336', color: 'white', padding: '20px', textAlign: 'center' }}>
        <h1>Resource Rejected</h1>
      </div>
      <div style={{ padding: '20px' }}>
        <p>Dear {name},</p>
        <p>Thank you for submitting the test revision material <b>{title}</b> for <b>{getYearGroupName(year)} {subject}</b>. After review from our teachers, we regret to inform you that your resource has been <b>rejected❌</b>, however you may wish to make updates and re-submit it. Thank you very much for your hard work and support.
        </p>
        <br />
        <p>Best regards,</p>
        <p><b>{deptName(subject)}</b></p>
      </div>
      <div style={{ backgroundColor: '#f8f8f8', padding: '15px', textAlign: 'center', fontSize: '12px', color: '#888', borderTop: '1px solid #ddd' }}>
        <p>&copy; {new Date().getFullYear()} Concordpedia. All rights reserved.</p>
      </div>
    </div>
    {doNotReply()}
  </div>
);

interface ApprovedOlympiadEmailTemplateProps {
  name: string;
  title: string;
  olympiad: string;
  area: string;
}

export const ApprovedOlympiadEmailTemplate: React.FC<Readonly<ApprovedOlympiadEmailTemplateProps>> = ({
  name, title, olympiad, area
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6', color: '#333' }}>
    <div style={{ maxWidth: '800px', margin: 'auto', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
      <div style={{ backgroundColor: '#4CAF50', color: 'white', padding: '20px', textAlign: 'center' }}>
        <h1>Resource Approved</h1>
      </div>
      <div style={{ padding: '20px' }}>
        <p>Dear {name},</p>
        <p>Thank you for submitting the prepatation material <b>{title}</b> for <b>{olympiad}</b>. After review from our teachers, we are delighted to inform you that your resource has been <b>accepted✅</b> and will now be available to be viewed and used on the website. Thank you very much for your hard work and support.</p>
        <br />
        <p>Best regards</p>
        <p><b>{deptName(area)}</b></p>
      </div>
      <div style={{ backgroundColor: '#f8f8f8', padding: '15px', textAlign: 'center', fontSize: '12px', color: '#888', borderTop: '1px solid #ddd' }}>
        <p>&copy; {new Date().getFullYear()} Concordpedia. All rights reserved.</p>
      </div>
    </div>
    {doNotReply()}
  </div>
);

interface RejectedOlympiadEmailTemplateProps {
  name: string;
  title: string;
  olympiad: string;
  area: string;
}

export const RejectedOlympiadEmailTemplate: React.FC<Readonly<RejectedOlympiadEmailTemplateProps>> = ({
  name, title, olympiad, area
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6', color: '#333' }}>
    <div style={{ maxWidth: '800px', margin: 'auto', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
      <div style={{ backgroundColor: '#F44336', color: 'white', padding: '20px', textAlign: 'center' }}>
        <h1>Resource Rejected</h1>
      </div>
      <div style={{ padding: '20px' }}>
        <p>Dear {name},</p>
        <p>Thank you for submitting the preparation material <b>{title}</b> for <b>{olympiad}</b>. After review from our teachers, we regret to inform you that your resource has been <b>rejected❌</b>, however you may wish to make updates and re-submit it. Thank you very much for your hard work and support.
        </p>
        <br />
        <p>Best regards,</p>
        <p><b>{deptName(area)}</b></p>
      </div>
      <div style={{ backgroundColor: '#f8f8f8', padding: '15px', textAlign: 'center', fontSize: '12px', color: '#888', borderTop: '1px solid #ddd' }}>
        <p>&copy; {new Date().getFullYear()} Concordpedia. All rights reserved.</p>
      </div>
    </div>
    {doNotReply()}
  </div>
);

interface UCASPostApprovedEmailTemplateProps {
  name: string;
  title: string;
}

export const UCASPostApprovedEmailTemplate: React.FC<Readonly<UCASPostApprovedEmailTemplateProps>> = ({
  name, title
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6', color: '#333' }}>
    <div style={{ maxWidth: '800px', margin: 'auto', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
      <div style={{ backgroundColor: '#4CAF50', color: 'white', padding: '20px', textAlign: 'center' }}>
        <h1>UCAS Post Approved</h1>
      </div>
      <div style={{ padding: '20px' }}>
        <p>Dear {name},</p>
        <p>Thank you for submitting the UCAS post {title}. It has now been <b>accepted✅</b> and is now available to be viewed on the website. Thank you very much for your hard work and support.
        </p>
        <br />
        <p>Best regards,</p>
        <p><b>Student Futures Team</b></p>
      </div>
      <div style={{ backgroundColor: '#f8f8f8', padding: '15px', textAlign: 'center', fontSize: '12px', color: '#888', borderTop: '1px solid #ddd' }}>
        <p>&copy; {new Date().getFullYear()} Concordpedia. All rights reserved.</p>
      </div>
    </div>
    {doNotReply()}
  </div>
);

interface UCASPostRejectedEmailTemplateProps {
  name: string;
  title: string;
}

export const UCASPostRejectedEmailTemplate: React.FC<Readonly<UCASPostRejectedEmailTemplateProps>> = ({
  name, title
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6', color: '#333' }}>
    <div style={{ maxWidth: '800px', margin: 'auto', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
      <div style={{ backgroundColor: '#F44336', color: 'white', padding: '20px', textAlign: 'center' }}>
        <h1>UCAS Post Rejected</h1>
      </div>
      <div style={{ padding: '20px' }}>
        <p>Dear {name},</p>
        <p>Thank you for submitting the UCAS post {title}. After review from our teachers, we regret to inform you that your post has been <b>rejected❌</b>, however you may wish to make updates and re-submit it. Thank you very much for your hard work and support.</p>
        <br />
        <p>Best regards,</p>
        <p><b>Student Futures Team</b></p>
      </div>
      <div style={{ backgroundColor: '#f8f8f8', padding: '15px', textAlign: 'center', fontSize: '12px', color: '#888', borderTop: '1px solid #ddd' }}>
        <p>&copy; {new Date().getFullYear()} Concordpedia. All rights reserved.</p>
      </div>
    </div>
    {doNotReply()}
  </div>
);

interface NewTestEmailTemplateProps {
  subject: {
    title: string;
    desc: string;
    id: number;
    level: number;
  },
  test: {
    title: string;
    desc: string;
    type: number;
    date: Date;
    id: number;
    subjectId: number;
    topics: string[];
  }
}

export const NewTestEmailTemplate: React.FC<Readonly<NewTestEmailTemplateProps>> = ({
  subject, test
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6', color: '#333' }}>
    <div style={{ maxWidth: '800px', margin: 'auto', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
      <div style={{ backgroundColor: '#2196F3', color: 'white', padding: '20px', textAlign: 'center' }}>
        <h1>New Test</h1>
      </div>
      <div style={{ padding: '20px' }}>
        <p>Dear Student,</p>
        <p>A new test for <b>{getYearGroupName(subject.level)} {subject.title}</b> has been scheduled.</p>
        <p><b>📅 Test Date:</b> {format(new Date(test.date), 'PPPP')}</p>
        <p><b>📝 Test Name:</b> {test.title}</p>

        <div style={{ padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px', border: '1px solid #eee', marginTop: '15px' }}>
          <h3 style={{ marginTop: 0 }}>ℹ️ Test Details:</h3>
          <ReactMarkdown>{test.desc}</ReactMarkdown>
        </div>

        <p>To view more details and access study materials, please click the button below:</p>
        <div style={{ textAlign: 'center', margin: '25px' }}>
          <a
            href={`https://concordhub.vercel.app/revision/${subject.id}/tests/${test.id}`}
            style={{
              backgroundColor: '#2196F3',
              color: 'white',
              padding: '12px 25px',
              textDecoration: 'none',
              borderRadius: '5px',
              fontWeight: 'bold',
              display: 'inline-block'
            }}
          >
            View Test Details
          </a>
        </div>
        <p>We wish you the best of luck with your preparation.</p>
        <br />
        <p>Best regards,</p>
        <p><b>{deptName(subject.title)}</b></p>
      </div>
      <div style={{ backgroundColor: '#f8f8f8', padding: '15px', textAlign: 'center', fontSize: '12px', color: '#888', borderTop: '1px solid #ddd' }}>
        <p>&copy; {new Date().getFullYear()} Concordpedia. All rights reserved.</p>
      </div>
    </div>
    {doNotReply()}
  </div>
);

interface NewResourceEmailTemplateProps {
  note: {
    id: number;
    title: string;
    subject: {
      title: string;
      id: number;
      level: number;
    };
  }
}

export const NewResourceEmailTemplate: React.FC<Readonly<NewResourceEmailTemplateProps>> = ({
  note
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6', color: '#333' }}>
    <div style={{ maxWidth: '800px', margin: 'auto', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
      <div style={{ backgroundColor: '#2196F3', color: 'white', padding: '20px', textAlign: 'center' }}>
        <h1>New Resource Uploaded</h1>
      </div>
      <div style={{ padding: '20px' }}>
        <p>Dear Student,</p>
        <p>A new resource for <b>{getYearGroupName(note.subject.level)} {note.subject.title}</b> has been added</p>
        <p><b>Resource Name:</b> {note.title}</p>

        <p>To view more details and access study materials, please click the button below:</p>
        <div style={{ textAlign: 'center', margin: '25px' }}>
          <a
            href={`https://concordhub.vercel.app/revision/${note.subject.id}/resources/${note.id}`}
            style={{
              backgroundColor: '#2196F3',
              color: 'white',
              padding: '12px 25px',
              textDecoration: 'none',
              borderRadius: '5px',
              fontWeight: 'bold',
              display: 'inline-block'
            }}
          >
            View Resource Details
          </a>
        </div>
        <p>Best regards,</p>
        <p><b>{deptName(note.subject.title)}</b></p>
      </div>
      <div style={{ backgroundColor: '#f8f8f8', padding: '15px', textAlign: 'center', fontSize: '12px', color: '#888', borderTop: '1px solid #ddd' }}>
        <p>&copy; {new Date().getFullYear()} Concordpedia. All rights reserved.</p>
      </div>
    </div>
    {doNotReply()}
  </div>
);