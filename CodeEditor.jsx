import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import axios from 'axios';
import { Container, Box, Typography, Paper, Select, MenuItem, Button, FormControl, InputLabel, Divider } from '@mui/material';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-monokai';

// Import Ace Editor extensions
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-searchbox';



const CodeEditor = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState('');
  const [expectedOutput, setExpectedOutput] = useState("hello");
  const [areOutputsEqual, setAreOutputsEqual] = useState(false);


  

  const handleRunCode = async () => {
    try {
      console.log(language, 'code: ', code);
      const response = await axios.post('http://localhost:8000/api/run', { code, language });
      setOutput(response.data.output.trim());
    } catch (error) {
      if (error.response) {
        console.error('Server responded with error:', error.response.data);
        setOutput('Error: ' + error.response.data.detail);
      } else if (error.request) {
        console.error('No response received:', error.request);
        setOutput('Error: No response received from server');
      } else {
        console.error('Error setting up request:', error.message);
        setOutput('Error: ' + error.message);
      }
    }
  };

  useEffect(() => {
    setAreOutputsEqual(expectedOutput == output);
  }, [output, expectedOutput]);

  
  const getMode = (language) => {
    switch (language) {
      case 'python': return 'python';
      case 'javascript': return 'javascript';
      case 'c':
      case 'cpp': return 'c_cpp';
      case 'java': return 'java';
      default: return 'text';
    }
  };

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Online Code Editor
        </Typography>

        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel id="language-select-label">Select Language</InputLabel>
          <Select
            labelId="language-select-label"
            id="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            label="Select Language"
          >
            <MenuItem value="python">Python</MenuItem>
            <MenuItem value="javascript">JavaScript</MenuItem>
            <MenuItem value="c">C</MenuItem>
            <MenuItem value="cpp">C++</MenuItem>
            <MenuItem value="java">Java</MenuItem>
          </Select>
        </FormControl>

        <Paper elevation={3} >
          <AceEditor
            mode={getMode(language)}
            theme="monokai"
            value={code}
            onChange={(value) => setCode(value)}
            name="code-editor"
            editorProps={{ $blockScrolling: true }}
            height="40vh"
            width="100%"
            enableBasicAutocompletion={language === 'java'}
            enableLiveAutocompletion={language === 'java'}
            enableSnippets={language === 'java'}
          />
        </Paper>
        <Box my={2} display="flex" justifyContent="center">
          <Button variant="contained" color="primary" onClick={handleRunCode}>
            Run Code
          </Button>
        </Box>
        <Paper
          elevation={3}
          mt={2}
          sx={{
            backgroundColor: output ? (areOutputsEqual ? '#388e3c' : '#ffd7039e') : 'inherit'
          }}
        >
          <Box display="flex" border="1px solid black">
            <Box flex="1" sx={{ width: '50%', overflow: 'auto', paddingRight: '5px', maxHeight: '200px', marginLeft: '10px' }}>
              <Typography variant="h6" gutterBottom align="center" borderBottom='2px solid #000'>
                Expected Output
              </Typography>
              <Typography component="pre" variant="body1" sx={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                {expectedOutput || 'No expected output provided.'}
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(0, 0, 0, 0.5)', borderWidth: '2px', margin: '0 20px' }} />
            <Box flex="1" sx={{ width: '50%', overflow: 'auto', paddingLeft: '5px', maxHeight: '200px', marginLeft: '10px'  }}>
              <Typography variant="h6" gutterBottom align="center" borderBottom='2px solid #000'>
                Actual Output
              </Typography>
              <Typography component="pre" variant="body1" sx={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                {output || 'Run the code to see the output.'}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default CodeEditor;
