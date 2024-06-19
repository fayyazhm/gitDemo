import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import axios from 'axios';
import { Container, Box, Typography, Paper, Select, MenuItem, Button, FormControl, InputLabel, Divider } from '@mui/material';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-monokai';
import ace from 'ace-builds';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-searchbox';

// Enable Autocomplete
ace.require("ace/ext/language_tools");

const CodeEditorAuto = () => {
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
    setAreOutputsEqual(expectedOutput === output);
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

  useEffect(() => {
    if (language === 'java') {
      // Custom Autocompletion for Java
      const javaCompleter = {
        getCompletions: function(editor, session, pos, prefix, callback) {
          const keywords = [
            { caption: "import java.util.*", value: "import java.util.*;", meta: "import" },
            { caption: "import java.io.*", value: "import java.io.*;", meta: "import" },
            { caption: "import java.util.ArrayList;", value: "import java.util.ArrayList;", meta: "import" },
            { caption: "import java.util.HashMap;", value: "import java.util.HashMap;", meta: "import" },
            { caption: "import java.util.HashSet;", value: "import java.util.HashSet;", meta: "import" },
            { caption: "import java.util.LinkedList;", value: "import java.util.LinkedList;", meta: "import" },
            { caption: "import java.util.concurrent.*", value: "import java.util.concurrent.*;", meta: "import" },
            { caption: "import java.nio.file.*", value: "import java.nio.file.*;", meta: "import" },
            { caption: "import java.net.*", value: "import java.net.*;", meta: "import" },
            { caption: "import java.sql.*", value: "import java.sql.*;", meta: "import" },
            { caption: "import javax.swing.*", value: "import javax.swing.*;", meta: "import" },
            { caption: "import javax.servlet.*", value: "import javax.servlet.*;", meta: "import" },
            { caption: "import org.apache.log4j.*", value: "import org.apache.log4j.*;", meta: "import" },
            { caption: "import java.util.Scanner;", value: "import java.util.Scanner;", meta: "import" },
            { caption: "import java.util.Date;", value: "import java.util.Date;", meta: "import" },
            { caption: "import java.util.Calendar;", value: "import java.util.Calendar;", meta: "import" },
            { caption: "import java.util.regex.*;", value: "import java.util.regex.*;", meta: "import" }
          ];

          const methods = [
            { caption: "add", value: "add", meta: "method" },
            { caption: "clear", value: "clear", meta: "method" },
            { caption: "contains", value: "contains", meta: "method" },
            { caption: "get", value: "get", meta: "method" },
            { caption: "isEmpty", value: "isEmpty", meta: "method" },
            { caption: "remove", value: "remove", meta: "method" },
            { caption: "size", value: "size", meta: "method" },
            // Add more methods as needed
          ];

          const completions = [...keywords, ...methods].map((item) => ({
            caption: item.caption,
            value: item.value,
            meta: item.meta,
          }));

          callback(null, completions);
        }
      };

      ace.require("ace/ext/language_tools").addCompleter(javaCompleter);
    }
  }, [language]);

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom  style={{ textDecoration: 'underline' }}> 
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
            setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true
            }}
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
            <Box flex="1" sx={{ width: '50%', overflow: 'auto', paddingRight: '5px', maxHeight: '200px', marginLeft: '10px'  }}>
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

export default CodeEditorAuto;
