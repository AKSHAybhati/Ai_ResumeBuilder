import React, {useState, useRef, useEffect} from 'react'
import { useResume } from '../../context/ResumeContext';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';

const Template3 = () => {
   const resumeRef = useRef(null);
    const { resumeData, setResumeData } = useResume();
    const [editMode, setEditMode] = useState(false);
    const [localData, setLocalData] = useState(resumeData);
  
    useEffect(() => {
      setLocalData(resumeData);
    }, [resumeData]);
  
    const handleFieldChange = (field, value) => {
      setLocalData((prev) => ({ ...prev, [field]: value }));
    };
  
    const handleArrayFieldChange = (section, index, key, value) => {
      const updated = [...localData[section]];
      updated[index][key] = value;
      setLocalData({ ...localData, [section]: updated });
    };
  
    const handleSave = () => {
      setResumeData(localData);
      setEditMode(false);
    };
  
    const handleCancel = () => {
      setLocalData(resumeData);
      setEditMode(false);
    };
  
    const handleEnhance = (section) => {
      console.log("Enhance requested for:", section);
    };

  return (
    <div style={{minHeight: "100vh", backgroundColor: "#f3f4f6"}}>
      <Navbar/>
      <div style={{display:"flex"}}>
        <Sidebar onEnhance={handleEnhance} resumeRef={resumeRef}/>

        <div style={{flexGrow: 1, padding:"2.5rem", display:"flex",flexDirection:"column", alignItems:"center"}}>
          <div 
          ref={resumeRef}
            style={{
              backgroundColor: "#FFFFFF",
              color: "#111827",
              maxWidth: "64rem",
              width: "100%",
              padding: "2rem",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              borderRadius: "0.5rem",
            }}
            > 
           <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: 'auto', padding: '20px', lineHeight: '1.6', color: '#000' }}>
  {/* Header */}
  <input type="text" defaultValue="John Doe" style={{ fontSize: '28px', fontWeight: 'bold', width: '100%', border: 'none' }} />
  <input type="text" defaultValue="FULL STACK DEVELOPER" style={{ fontSize: '16px', marginBottom: '10px', width: '100%', border: 'none' }} />

  {/* Contact */}
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
    <input type="text" defaultValue="123-456-7890" style={{ border: 'none' }} />
    <input type="text" defaultValue="john@example.com" style={{ border: 'none' }} />
    <input type="text" defaultValue="Pune" style={{ border: 'none' }} />
    <input type="text" defaultValue="https://linkedin.com/in/john" style={{ border: 'none' }} />
  </div>

  {/* Profile */}
  <h3 style={{ borderBottom: '2px solid black',fontWeight: 'bold' }}>PROFILE</h3>
  <textarea
    rows="1"
    defaultValue="Passionate full-stack developer with 3+ years of experience..."
    style={{ width: '100%', border: 'none', resize: 'none' }}
  />

  {/* Experience */}
  <h3 style={{ borderBottom: '2px solid black',fontWeight: 'bold', marginTop: '30px' }}>EXPERIENCE</h3>
  <input type="text" defaultValue="Software Developer" style={{ border: 'none', width: '100%' }} />
  <input type="text" defaultValue="ABC Pvt Ltd | 2020 - Present" style={{ border: 'none', width: '100%' }} />
  <input type="text" defaultValue="Mumbai" style={{ border: 'none', width: '100%' }} />
  <ul style={{ marginTop: '5px' }}>
    <li><input type="text" defaultValue="Built scalable MERN applications used by 10k+ users." style={{ border: 'none', width: '100%' }} /></li>
    <li><input type="text" defaultValue="Improved API performance by 40%." style={{ border: 'none', width: '100%' }} /></li>
  </ul>

  {/* Education */}
  <h3 style={{ borderBottom: '2px solid black',fontWeight: 'bold', marginTop: '30px' }}>EDUCATION</h3>
  <input type="text" defaultValue="B.Tech in Computer Science" style={{  border: 'none', width: '100%' }} />
  <input type="text" defaultValue="XYZ University" style={{ border: 'none', width: '100%' }} />
  <input type="text" defaultValue="2016 - 2020" style={{ border: 'none', width: '100%' }} />
  <input type="text" defaultValue="Pune" style={{ border: 'none', width: '100%' }} />

  {/* Projects */}
  <h3 style={{ borderBottom: '2px solid black',fontWeight: 'bold', marginTop: '30px' }}>PROJECTS</h3>
  <input type="text" defaultValue="StudySync" style={{ border: 'none', width: '100%' }} />
  <input type="text" defaultValue={["React", "Express", "MongoDB"]} style={{ border: 'none', width: '100%', marginTop: '5px' }} />
  <input type="text" defaultValue="https://studysync.dev" style={{  border: 'none', width: '100%' }} />
  <input type="text" defaultValue="https://github.com/johndoe/studysync" style={{  border: 'none', width: '100%' }} />
  <textarea
    defaultValue="An online platform where students can upload, download, and interact with study notes."
    style={{ width: '100%', border: 'none', resize: 'none' }}
    rows={1}
  />

  {/* Certifications */}
  <h3 style={{ borderBottom: '2px solid black',fontWeight: 'bold', marginTop: '30px' }}>CERTIFICATIONS</h3>
  <input type="text" defaultValue="AWS Certified developer" style={{ border: 'none', width: '100%' }} />
  <input type="text" defaultValue="Amazon" style={{ border: 'none', width: '100%' }} />
  <input type="text" defaultValue="Jan 2023" style={{ border: 'none', width: '100%' }} />
</div>

        </div>
        </div>
      </div>
    </div>
  )
}
export default Template3;