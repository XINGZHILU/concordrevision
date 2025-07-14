import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import * as React from 'react';

interface ApprovedEmailTemplateProps {
  name: string;
  title: string;
  area: string;
}

export const ApprovedEmailTemplate: React.FC<Readonly<ApprovedEmailTemplateProps>> = ({
  name, title, area
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6', color: '#333' }}>
    <div style={{ maxWidth: '800px', margin: 'auto', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
      <div style={{ backgroundColor: '#4CAF50', color: 'white', padding: '20px', textAlign: 'center' }}>
        <h1>Resource Approved</h1>
      </div>
      <div style={{ padding: '20px' }}>
        <p>Dear {name},</p>
        <p>Thank you for submitting the test revision material <b>{title}</b> for <b>{area}</b>. After review from our teachers, we are delighted to inform you that your resource has been <b>accepted</b> and will now be available to be viewed and used on the website. Thank you very much for your hard work and support.</p>
        <br />
        <p>Best regards,</p>
        <p><b>The Concord Student Hub Team</b></p>
      </div>
      <div style={{ backgroundColor: '#f8f8f8', padding: '15px', textAlign: 'center', fontSize: '12px', color: '#888', borderTop: '1px solid #ddd' }}>
        <p>&copy; {new Date().getFullYear()} Concord Student Hub. All rights reserved.</p>
      </div>
    </div>
  </div>
);

interface RejectedEmailTemplateProps {
  name: string;
  title: string;
  area: string;
}

export const RejectedEmailTemplate: React.FC<Readonly<RejectedEmailTemplateProps>> = ({
  name, title, area
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6', color: '#333' }}>
    <div style={{ maxWidth: '800px', margin: 'auto', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
      <div style={{ backgroundColor: '#F44336', color: 'white', padding: '20px', textAlign: 'center' }}>
        <h1>Resource Rejected</h1>
      </div>
      <div style={{ padding: '20px' }}>
        <p>Dear {name},</p>
        <p>Thank you for submitting the test revision material <b>{title}</b> for <b>{area}</b>. After review from our teachers, we regret to inform you that your resource has been <b>rejected</b>, however you may wish to make updates and re-submit it. Thank you very much for your hard work and support.
        </p>
        <br />
        <p>Best regards,</p>
        <p><b>The Concord Student Hub Team</b></p>
      </div>
      <div style={{ backgroundColor: '#f8f8f8', padding: '15px', textAlign: 'center', fontSize: '12px', color: '#888', borderTop: '1px solid #ddd' }}>
        <p>&copy; {new Date().getFullYear()} Concord Student Hub. All rights reserved.</p>
      </div>
    </div>
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
        <p>Thank you for submitting the UCAS post {title}. It is now available to be viewed on the website. Thank you very much for your hard work and support.
        </p>
        <br />
        <p>Best regards,</p>
        <p><b>The Concord Student Hub Team</b></p>
      </div>
      <div style={{ backgroundColor: '#f8f8f8', padding: '15px', textAlign: 'center', fontSize: '12px', color: '#888', borderTop: '1px solid #ddd' }}>
        <p>&copy; {new Date().getFullYear()} Concord Student Hub. All rights reserved.</p>
      </div>
    </div>
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
        <p>Thank you for submitting the UCAS post {title}. After review from our teachers, we regret to inform you that your post has been <b>rejected</b>, however you may wish to make updates and re-submit it. Thank you very much for your hard work and support.</p>
        <br />
        <p>Best regards,</p>
        <p><b>The Concord Student Hub Team</b></p>
      </div>
      <div style={{ backgroundColor: '#f8f8f8', padding: '15px', textAlign: 'center', fontSize: '12px', color: '#888', borderTop: '1px solid #ddd' }}>
        <p>&copy; {new Date().getFullYear()} Concord Student Hub. All rights reserved.</p>
      </div>
    </div>
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
        <h1>New Test Announcement</h1>
      </div>
      <div style={{ padding: '20px' }}>
        <p>Dear Student,</p>
        <p>A new test for <b>{subject.title}</b> has been scheduled on <b>{format(new Date(test.date), 'PPPP')}</b>.</p>
        <p><b>Test Name:</b> {test.title}</p>

        <div style={{ padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px', border: '1px solid #eee', marginTop: '15px' }}>
          <h3 style={{ marginTop: 0 }}>Test Details:</h3>
          <ReactMarkdown>{test.desc}</ReactMarkdown>
        </div>

        {test.topics && test.topics.length > 0 && (
          <div style={{ padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px', border: '1px solid #eee', marginTop: '15px' }}>
            <h3 style={{ marginTop: 0 }}>Topics Covered:</h3>
            <ul style={{ paddingLeft: '20px', marginTop: 0 }}>
              {test.topics.map((topic, index) => (
                <li key={index}>{topic}</li>
              ))}
            </ul>
          </div>
        )}

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
        <p><b>The Concord Student Hub Team</b></p>
      </div>
      <div style={{ backgroundColor: '#f8f8f8', padding: '15px', textAlign: 'center', fontSize: '12px', color: '#888', borderTop: '1px solid #ddd' }}>
        <p>&copy; {new Date().getFullYear()} Concord Student Hub. All rights reserved.</p>
      </div>
    </div>
  </div>
);