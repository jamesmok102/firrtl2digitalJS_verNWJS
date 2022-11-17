import $ from 'jquery';
import * as digitaljs from './digitaljs/main'

var circuit, monitor, monitorview, iopanel, paper, current_file = 'input.v';
    var start = $('button[name=start]');
    var stop = $('button[name=stop]');
    var papers = {};
    const fixed = function (fixed) {
      Object.values(papers).forEach(p => p.fixed(fixed));
    }
    const loadCircuit = function (json) {
      circuit = new digitaljs.Circuit(json);
      monitor = new digitaljs.Monitor(circuit);
      monitorview = new digitaljs.MonitorView({model: monitor, el: $('#monitor') });
      iopanel = new digitaljs.IOPanelView({model: circuit, el: $('#iopanel') });
      circuit.on('new:paper', function(paper) {
        paper.fixed($('input[name=fixed]').prop('checked'));
        papers[paper.cid] = paper;
        paper.on('element:pointerdblclick', (cellView) => {
          window.digitaljsCell = cellView.model;
          console.info('You can now access the doubly clicked gate as digitaljsCell in your WebBrowser console!');
        });
      });
      circuit.on('changeRunning', () => {
        if (circuit.running) {
          start.prop('disabled', true);
          stop.prop('disabled', false);
        } else {
          start.prop('disabled', false);
          stop.prop('disabled', true);
        }
      });
      paper = circuit.displayOn($('#paper'));
      fixed($('input[name=fixed]').prop('checked'));
      circuit.on('remove:paper', function(paper) {
        delete papers[paper.cid];
      });
      circuit.start();
    }
    start.on('click', (e) => { circuit.start(); });
    stop.on('click', (e) => { circuit.stop(); });
    $('button[name=json]').on('click', (e) => {
      monitorview.shutdown();
      iopanel.shutdown();
      circuit.stop();
      const json = circuit.toJSON($('input[name=layout]').prop('checked'));
      console.log(json);
      loadCircuit(json);
    });
    $('input[name=fixed]').change(function () {
      fixed($(this).prop('checked'));
    });
    $('button[name=ppt_up]').on('click', (e) => { monitorview.pixelsPerTick *= 2; });
    $('button[name=ppt_down]').on('click', (e) => { monitorview.pixelsPerTick /= 2; });
    $('button[name=left]').on('click', (e) => { monitorview.live = false; monitorview.start -= monitorview._width / monitorview.pixelsPerTick / 4; });
    $('button[name=right]').on('click', (e) => { monitorview.live = false; monitorview.start += monitorview._width / monitorview.pixelsPerTick / 4; });
    $('button[name=live]').on('click', (e) => { monitorview.live = true; });
    $('#imports').click(() => {
      $('#files').click();
    });
    $('#imports_json').click(() => {
      $('#files_json').click();
    });
    $('#sim').click(() => sim());
    $('#sim_json').click(() => sim_json());
    function imports() {
      const selected = document.getElementById('files').files[0];
      if (!selected) return;
      current_file = selected.name.replace(/\s+/g, "-");
      const reader = new FileReader();
      reader.readAsText(selected);
      reader.onload = function() {
        document.getElementById('output').value = this.result;
      }
    }

    const imports_json = function () {
      var input_file = document.getElementById('files_json');
        //var input_file = files[0]
      const selected = input_file.files[0];
      if (!selected) return;
      const fileName = input_file.value.substring(input_file.value.lastIndexOf(".")+1).toLowerCase();
      console.log(fileName);
      // if(fileName != "json") {
      //   alert("请选择JSON格式文件上传(.json)")
      //   input_file.value = "";
      //   return;
      // }
      current_file = selected.name.replace(/\s+/g, "-");
      const reader = new FileReader();
      reader.readAsText(selected);
      reader.onload = function() {
        document.getElementById('output').value = this.result;
      }
    }

    function sim_json() {
      const input = document.getElementById('output').value;
      // let result = ""
        if (!input) {
        alert('请输入有效描述');
        return;
      }
      fetch(`http://127.0.0.1:5000/postFirrtlCode`,{
        method:'POST',
        headers:{
          'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: input
      }).then(response=>{
        console.log('响应',response)
        fetch('http://127.0.0.1:5000/')
        .then(response => response.json())
        .then(data => {
          console.log(data)
          //result = data
          //console.log(result)
          loadCircuit(data)
        });
      })
      //parse_json = JSON.parse(input);
      //console.log(parse_json)
      //loadCircuit(parse_json);

    }

    function exapmleToTextarea(input_path) {
      $.getJSON(input_path, function(data) {
          document.getElementById('output').value = JSON.stringify(data, undefined, 4);
        });
    }

    window.imports_json = imports_json
    window.loadCircuit = loadCircuit

    // $("#json_example").change(function () {
    //   var isCheck = $(this).children('option:selected').val();
    //   if (isCheck == "cycleadder_arst") {
    //     exapmleToTextarea("./digitaljs_json_example/cycleadder_arst.json")
    //   }
    //   else if (isCheck == "dff_masterslave") {
    //     exapmleToTextarea("./digitaljs_json_example/dff_masterslave.json")
    //   }
    //   else if (isCheck == "dlatch_gate") {
    //     exapmleToTextarea("./digitaljs_json_example/dlatch_gate.json")
    //   }
    //   else if (isCheck == "fsm") {
    //     exapmleToTextarea("./digitaljs_json_example/fsm.json")
    //   }
    //   else if (isCheck == "fulladder") {
    //     exapmleToTextarea("./digitaljs_json_example/fulladder.json")
    //   }
    //   else if (isCheck == "lfsr") {
    //     exapmleToTextarea("./digitaljs_json_example/lfsr.json")
    //   }
    //   else if (isCheck == "prio_encoder") {
    //     exapmleToTextarea("./digitaljs_json_example/prio_encoder.json")
    //   }
    //   else if (isCheck == "ram") {
    //     exapmleToTextarea("./digitaljs_json_example/ram.json")
    //   }
    //   else if (isCheck == "rom") {
    //     exapmleToTextarea("./digitaljs_json_example/rom.json")
    //   }
    //   else if (isCheck == "serialadder") {
    //     exapmleToTextarea("./digitaljs_json_example/serialadder.json")
    //   }
    //   else if (isCheck == "sr_gate") {
    //     exapmleToTextarea("./digitaljs_json_example/sr_gate.json")
    //   }
    //   else if (isCheck == "sr_neg_gate") {
    //     exapmleToTextarea("./digitaljs_json_example/sr_neg_gate.json")
    //   }

    // });









