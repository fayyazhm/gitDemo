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

const CodeEditorAuto_3 = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState('');
  const [expectedOutput, setExpectedOutput] = useState("hello");
  const [areOutputsEqual, setAreOutputsEqual] = useState(false);

  // Dictionaries to store objects and their methods
  const objectsDict = {};
  const methodsDict = {
    ArrayList: ['add', 'remove', 'size', 'get'],
    HashSet: ['add', 'remove', 'contains'],
    HashMap: ['put', 'get', 'remove', 'containsKey'],
    // Add more classes and their methods here
  };

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
        getCompletions: function (editor, session, pos, prefix, callback) {
          const keywords = [
            // Java keywords
            'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class', 'const', 'continue', 
            'default', 'do', 'double', 'else', 'enum', 'extends', 'final', 'finally', 'float', 'for', 'goto', 
            'if', 'implements', 'import', 'instanceof', 'int', 'interface', 'long', 'native', 'new', 'null', 
            'package', 'private', 'protected', 'public', 'return', 'short', 'static', 'strictfp', 'super', 
            'switch', 'synchronized', 'this', 'throw', 'throws', 'transient', 'try', 'void', 'volatile', 'while'
          ];

          // Create completion suggestions for Java keywords
          const completions = keywords.map(keyword => ({
            caption: keyword,
            value: keyword,
            meta: "keyword"
          }));

          const currentLine = editor.session.getLine(pos.row);
          const currentWord = currentLine.slice(0, pos.column).split(/\s+/).pop();

          console.log("currentLine:", currentLine);
          console.log("currentWord:", currentWord);

          // Adjusted regex to match object declaration including generics
          const declarationMatch = currentLine.match(/(\w+<.*?>)?\s+(\w+)\s*=\s*new\s+(\w+<.*?>)?\s*\(/);

          console.log("declarationMatch:", declarationMatch);

          if (declarationMatch) {
            const [, , variableName, classNameWithGenerics] = declarationMatch;
            const className = classNameWithGenerics ? classNameWithGenerics.split('<')[0] : null;

            if (className) {
              if (!objectsDict[className]) {
                objectsDict[className] = [];
              }
              if (!objectsDict[className].includes(variableName)) {
                objectsDict[className].push(variableName);
                console.log(`${className} object ${variableName} created and stored`);
              }
            }
          }

          // Check if the current word matches any variable name in objectsDict
          Object.keys(objectsDict).forEach(className => {
            if (objectsDict[className].includes(currentWord)) {
              completions.push(...methodsDict[className].map(method => ({
                caption: method,
                value: method,
                meta: "method"
              })));
            }
          });

          callback(null, completions);
        }
      };

      ace.require("ace/ext/language_tools").addCompleter(javaCompleter);
    }
  }, [language]);

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom style={{ textDecoration: 'underline' }}>
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

        <Paper elevation={3}>
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
            <Box flex="1" sx={{ width: '50%', overflow: 'auto', paddingRight: '5px', maxHeight: '200px', marginLeft: '10px' }}>
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

export default CodeEditorAuto_3;
