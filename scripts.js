
function addDDLREAD(){
	for(var i=0; i<simulador.dados.length;i++)
		$('.ddlRead').html($('.ddlRead').html() + '<option value="' + simulador.dados[i] + '">' + simulador.dados[i] + '</option>' );
}

function addDDLWRITE(){
	for(var i=0; i<simulador.dados.length;i++)
		$('.ddlWrite').html($('.ddlWrite').html() + '<option value="' + simulador.dados[i] + '">' + simulador.dados[i] + '</option>' );
}






//Constructor
	function Simulador(){
		this.dados = [];
		this.t1 =[];
		this.t2 =[];
		this.t3 =[];
		this.t4 =[];
	}

	function Transacao(){
		this.dado = null;
		this.read = false;
		this.write = false;
		this.commit = false;
		this.abort = false;
	}

//Instance
	var simulador = new Simulador();

//Events

	//textbox enter event
	$('#IdDados').on('keyup',function(){
		event.preventDefault();
	  	// Number 13 is the "Enter" key on the keyboard
	  	if (event.keyCode === 13) {
	    // Trigger the button element with a click
	    	$('#idDadosCadastrados').html($('#idDadosCadastrados').html() + " " + $('#IdDados').val());
	    	simulador.dados.push($('#IdDados').val());
	    	$('#IdDados').val('');
	  }
	});

	//buttonsEvents
	$('#addTransacao').on('click',function(){
		addDDLREAD();
		addDDLWRITE();
		readEvent();
		writeEvent();
		showDivs();
	})

	$('#commitT1').on('click',function(){
		var t = new Transacao();
		t.commit = true;
		commitAbortEventT1();
		$('#H1').html($('#H1').html() + " -> " + "commit");
	});

	$('#commitT2').on('click',function(){
		var t = new Transacao();
		t.commit = true;
		commitAbortEventT2();
		$('#H2').html($('#H2').html() + " -> " + "commit");
	});

	$('#commitT3').on('click',function(){
		var t = new Transacao();
		t.commit = true;
		commitAbortEventT3();
		$('#H3').html($('#H3').html() + " -> " + "commit");
	});

	$('#commitT4').on('click',function(){
		var t = new Transacao();
		t.commit = true;
		commitAbortEventT4();
		$('#H4').html($('#H4').html() + " -> " + "commit");
	});

	$('#abortT1').on('click',function(){
		var t = new Transacao();
		t.abort = true;
		commitAbortEventT1();
		$('#H1').html($('#H1').html() + " -> " + "abort");
	});

	$('#abortT2').on('click',function(){
		var t = new Transacao();
		t.abort = true;
		commitAbortEventT2();
		$('#H2').html($('#H2').html() + " -> " + "abort");
	});

	$('#abortT3').on('click',function(){
		var t = new Transacao();
		t.abort = true;
		commitAbortEventT3();
		$('#H3').html($('#H3').html() + " -> " + "abort");
	});

	$('#abortT4').on('click',function(){
		var t = new Transacao();
		t.abort = true;
		commitAbortEventT4();
		$('#H4').html($('#H4').html() + " -> " + "abort");
	});



	var readEventT1 = function(){ $("#T1R").on('change',function(){
		var t1 = new Transacao();
		t1.dado = $("#T1R").val();
		t1.read = true;
		simulador.t1.push(t1);

		if($('#H1').html() == "")
			$('#H1').html("startT1 -> " + "r(" + $("#T1R").val() + ")");
		else
			$('#H1').html($('#H1').html() + " -> " + "r(" + $("#T1R").val() + ")");
	})};
	var writeEventT1 = function(){ $("#T1W").on('change',function(){
		var t1 = new Transacao();
		t1.dado = $("#T1W").val();
		t1.write = true;
		simulador.t1.push(t1);

		if($('#H1').html() == "")
			$('#H1').html("startT1 -> " + "w(" + $("#T1W").val() + ")");
		else
			$('#H1').html($('#H1').html() + " -> " + "w(" + $("#T1W").val() + ")");
	})};

	var readEventT2 = function(){ $("#T2R").on('change',function(){
		var t2 = new Transacao();
		t2.dado = $("#T2R").val();
		t2.read = true;
		simulador.t2.push(t2);

		if($('#H2').html() == "")
			$('#H2').html("startT2 -> " + "r(" + $("#T2R").val() + ")");
		else
			$('#H2').html($('#H2').html() + " -> " + "r(" + $("#T2R").val() + ")");
	})};
	var writeEventT2 = function(){ $("#T2W").on('change',function(){
		var t2 = new Transacao();
		t2.dado = $("#T2W").val();
		t2.write = true;
		simulador.t2.push(t2);

		if($('#H2').html() == "")
			$('#H2').html("startT2 -> " + "w(" + $("#T2W").val() + ")");
		else
			$('#H2').html($('#H2').html() + " -> " + "w(" + $("#T2W").val() + ")");
	})};

	var readEventT3 = function(){ $("#T3R").on('change',function(){
		var t3 = new Transacao();
		t3.dado = $("#T3R").val();
		t3.read = true;
		simulador.t3.push(t3);

		if($('#H3').html() == "")
			$('#H3').html("startT3 -> " + "r(" + $("#T3R").val() + ")");
		else
			$('#H3').html($('#H3').html() + " -> " + "r(" + $("#T3R").val() + ")");
	})};
	var writeEventT3 = function(){ $("#T3W").on('change',function(){
		var t3 = new Transacao();
		t3.dado = $("#T3W").val();
		t3.write = true;
		simulador.t3.push(t3);

		if($('#H3').html() == "")
			$('#H3').html("startT3 -> " + "w(" + $("#T3W").val() + ")");
		else
			$('#H3').html($('#H3').html() + " -> " + "w(" + $("#T3W").val() + ")");
	})};

	var readEventT4 = function(){ $("#T4R").on('change',function(){
		var t4 = new Transacao();
		t4.dado = $("#T4R").val();
		t4.read = true;
		simulador.t4.push(t4);

		if($('#H4').html() == "")
			$('#H4').html("startT4 -> " + "r(" + $("#T4R").val() + ")");
		else
			$('#H4').html($('#H4').html() + " -> " + "r(" + $("#T4R").val() + ")");
	})};
	var writeEventT4 = function(){ $("#T4W").on('change',function(){
		var t4 = new Transacao();
		t4.dado = $("#T4W").val();
		t4.read = true;
		simulador.t4.push(t4);

		if($('#H4').html() == "")
			$('#H4').html("startT4 -> " + "w(" + $("#T4W").val() + ")");
		else
			$('#H4').html($('#H4').html() + " -> " + "w(" + $("#T4W").val() + ")");
	})};

	var commitAbortEventT1 = function(){
		$('#T1R').attr('disabled', 'disabled');
		$('#T1W').attr('disabled', 'disabled');
	}

	var commitAbortEventT2 = function(){
		$('#T2R').attr('disabled', 'disabled');
		$('#T2W').attr('disabled', 'disabled');
	}

	var commitAbortEventT3 = function(){
		$('#T3R').attr('disabled', 'disabled');
		$('#T3W').attr('disabled', 'disabled');
	}

	var commitAbortEventT4 = function(){
		$('#T4R').attr('disabled', 'disabled');
		$('#T4W').attr('disabled', 'disabled');
	}

	var readEvent = function(){
		readEventT1()
		readEventT2()
		readEventT3()
		readEventT4()
	}

	var writeEvent = function(){
		writeEventT1()
		writeEventT2()
		writeEventT3()
		writeEventT4()
	}

	var commitAbortEvent = function(){
		commitAbortEventT1();
		commitAbortEventT2();
		commitAbortEventT3();
		commitAbortEventT4();
	}

	var showDivs = function(){
		if($('#rdb1').is(':checked')){
			$( "#T1" ).removeClass( "esconder" );
			$( "#T2" ).removeClass( "esconder" )	
		}
		else if($('#rdb2').is(':checked')){
			$( "#T1" ).removeClass( "esconder" );
			$( "#T2" ).removeClass( "esconder" )
			$( "#T3" ).removeClass( "esconder" )
		}
		else if($('#rdb3').is(':checked')){
			$( "#T1" ).removeClass( "esconder" );
			$( "#T2" ).removeClass( "esconder" )
			$( "#T3" ).removeClass( "esconder" )
			$( "#T4" ).removeClass( "esconder" )

		}
	}
	