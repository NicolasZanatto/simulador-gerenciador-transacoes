

//Adquirindo bloqueios.
var deadlock = 0;

function addBlocks(){
	for(var i = 0; i < historia.HI.length; i++){
		if(historia.Delay.length!=0)
			if(verificaTudo(historia.Delay[0],true))
				historia.Delay.shift();	

		if(verificaTudo(historia.HI[i],false))
			var deadlock = 0;;
	}
	while(historia.Delay.length!=0 && deadlock<10){
		if(verificaTudo(historia.Delay[0],true))
				historia.Delay.shift();
		else
			deadlock++;
	}
	if(deadlock==10)
	{
		console.log("DEADLOCK");
		return;
	}
}
//Métodos

function verificaTudo(operacao,ehDelay){

	if(!verificaSeTransacaoEstaEmDelay(operacao) || ehDelay){
		var indice = retornaIndice(operacao);
		var blockExclusivo = estaBloqueadoExclusivo(operacao);
		var blockCompartilhado = estaBloqueadoCompartilhado(operacao)
		if(operacao.read){
			if(blockCompartilhado!=1 && blockCompartilhado!=2 && blockExclusivo == 0)
			{
				simulador.dados[indice].blockCompartilhado.push(operacao.nome);
				historia.HF.push(operacao);
				return true;
			}
			else if(!ehDelay){
				historia.Delay.push(operacao);			
				return false;
			}
			else if(ehDelay)
				return false;

		}
		else if(operacao.write){
			if(blockExclusivo==0 && blockCompartilhado==0){
				simulador.dados[indice].blockExclusivo = operacao.nome;
				historia.HF.push(operacao);
				return true;
			}
			else if(blockExclusivo==0 && blockCompartilhado==1){
				simulador.dados[indice].blockCompartilhado = [];
				simulador.dados[indice].blockExclusivo = operacao.nome;
				historia.HF.push(operacao);
				return true;
			}
			else if(!ehDelay){
				historia.Delay.push(operacao);
				return false;
			}
		}
		else if(operacao.commit){
			for(var i = 0; i < simulador.dados.length; i++){
				if(simulador.dados[i].blockCompartilhado.length!=0){
					for(var j = 0;j < simulador.dados[i].blockCompartilhado.length; j++){
						if(simulador.dados[i].blockCompartilhado[j] == operacao.nome){
							simulador.dados[i].blockCompartilhado.splice(j,1);
						}
					}
				}
				if(simulador.dados[i].blockExclusivo!=null && simulador.dados[i].blockExclusivo == operacao.nome)
					simulador.dados[i].blockExclusivo = null;
			}
		}
		else if(operacao.abort){
			for(var i = 0; i< historia.HF.length;i++){
				if(historia.HF[i].nome == operacao.nome){
					for(var j = 0; j< simulador.dados.length; j++)
					{
						if(simulador.dados[j].blockExclusivo == operacao.nome)
							simulador.dados[j].blockExclusivo = null
						for(var k = 0; k < simulador.dados[j].blockCompartilhado.length; k++ )
							if(simulador.dados[j].blockCompartilhado[k] == operacao.nome)
								simulador.dados[j].blockCompartilhado.splice(k,1);		
					}
						historia.Delay.push(historia.HF[i]);
						historia.HF.splice(i,1);					
				}
			}
		}	 
	}
	else if(!ehDelay){
		historia.Delay.push(operacao);		
		return true;
	}
	else if(ehDelay)
		return false;
}

//Métodos auxiliares
function estaBloqueadoCompartilhado(operação){
	for(var i=0; i < simulador.dados.length; i++){
		if(simulador.dados[i].dado == operação.dado){
			if(simulador.dados[i].blockCompartilhado.length == 0)
				return 0; // se nao tem nenhum bloqueio compartilhado
			else if(simulador.dados[i].blockCompartilhado.includes(operação.nome) && simulador.dados[i].blockCompartilhado.length == 1)
				return 1; // se o único bloqueio compartilhado para esse dado é dessa transacao.
			else if(simulador.dados[i].blockCompartilhado.includes(operação.nome))
				return 2;
			else 
				return 3; // já tem um bloqueio compartilhado de outra transação pra esse dado
		}
	}
}

function estaBloqueadoExclusivo(operação){
	for(var i=0; i < simulador.dados.length; i++){
		if(simulador.dados[i].dado == operação.dado){
			if(simulador.dados[i].blockExclusivo==null)
				return 0; // se nao tem block exclusivo
			else if(simulador.dados[i] != operação.nome)
				return 1; // se tem block exclusivo mas nao é o mesmo da operacao
			else if (simulador.dados[i] == operação.nome)
				return 2; // se tem block exclusivo e é o mesmo da operação
		}
	}
}

//Criando História
function createHistory(){
	var finish = 0;
	var i=0;
	while(!finish){
		if(simulador.t1[i]== undefined && simulador.t2[i]== undefined && simulador.t3[i]== undefined && simulador.t4[i]== undefined){
			finish = 1;
		}
		else
		{
			if(simulador.t1[i]!= undefined)
				historia.HI.push(simulador.t1[i])
			if(simulador.t2[i]!= undefined)
				historia.HI.push(simulador.t2[i])
			if(simulador.t3[i]!= undefined)
				historia.HI.push(simulador.t3[i])
			if(simulador.t4[i]!= undefined)
				historia.HI.push(simulador.t4[i])
			i++;
		}
	}

}

function retornaIndice(operacao){
	for(var i = 0; i< simulador.dados.length;i++)
		if(simulador.dados[i].dado == operacao.dado)
			return i;
}

function verificaSeTransacaoEstaEmDelay(operacao){
	for(var i = 0; i < historia.Delay.length; i++)
		if(historia.Delay[i].nome == operacao.nome)
			return true;

	return false;
}

function addDDLREAD(){
	for(var i=0; i<simulador.dados.length;i++)
		$('.ddlRead').html($('.ddlRead').html() + '<option value="' + simulador.dados[i].dado + '">' + simulador.dados[i].dado + '</option>' );
}

function addDDLWRITE(){
	for(var i=0; i<simulador.dados.length;i++)
		$('.ddlWrite').html($('.ddlWrite').html() + '<option value="' + simulador.dados[i].dado + '">' + simulador.dados[i].dado + '</option>' );
}

//Constructor
	function Simulador(){
		this.dados = [];
		this.t1 =[];
		this.t2 =[];
		this.t3 =[];
		this.t4 =[];
	}

	function Dado(){
		this.dado = null;
		this.blockCompartilhado = [];
		this.blockExclusivo = null;
	}

	function Transacao(){
		this.nome = null;
		this.dado = null;
		this.read = false;
		this.write = false;
		this.commit = false;
		this.abort = false;
	}

	function Historia(){
		this.HI = [];
		this.HF = [];
		this.Delay =[];
	}

	var Transacao1 = "T1",
		Transacao2 = "T2",
		Transacao3 = "T3",
		Transacao4 = "T4",
		ls = 0,
		lx = 1;

//Instance
	var simulador = new Simulador();
	var historia = new Historia();
//Events

	//textbox enter event
	$('#IdDados').on('keyup',function(){
		event.preventDefault();
	  	// Number 13 is the "Enter" key on the keyboard
	  	if (event.keyCode === 13) {
	    // Trigger the button element with a click
	    	$('#idDadosCadastrados').html($('#idDadosCadastrados').html() + " " + $('#IdDados').val());
	    	var d = new Dado();
	    	d.dado = $('#IdDados').val();
	    	simulador.dados.push(d);
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
		btnIniciar();
	})

	$('#commitT1').on('click',function(){
		var t = new Transacao();
		t.commit = true;
		t.nome = Transacao1;
		simulador.t1.push(t);
		commitAbortEventT1();
		$('#H1').html($('#H1').html() + " -> " + "commit");
	});

	$('#commitT2').on('click',function(){
		var t = new Transacao();
		t.commit = true;
		t.nome = Transacao2;
		simulador.t2.push(t);
		commitAbortEventT2();
		$('#H2').html($('#H2').html() + " -> " + "commit");
	});

	$('#commitT3').on('click',function(){
		var t = new Transacao();
		t.commit = true;
		t.nome = Transacao3;
		simulador.t3.push(t);
		commitAbortEventT3();
		$('#H3').html($('#H3').html() + " -> " + "commit");
	});

	$('#commitT4').on('click',function(){
		var t = new Transacao();
		t.commit = true;
		t.nome = Transacao4;

		simulador.t4.push(t);
		commitAbortEventT4();
		$('#H4').html($('#H4').html() + " -> " + "commit");
	});

	$('#abortT1').on('click',function(){
		var t = new Transacao();
		t.abort = true;
		t.nome = Transacao1;
		simulador.t1.push(t);
		commitAbortEventT1();
		$('#H1').html($('#H1').html() + " -> " + "abort");
	});

	$('#abortT2').on('click',function(){
		var t = new Transacao();
		t.abort = true;
		t.nome = Transacao2;
		simulador.t2.push(t);
		commitAbortEventT2();
		$('#H2').html($('#H2').html() + " -> " + "abort");
	});

	$('#abortT3').on('click',function(){
		var t = new Transacao();
		t.abort = true;
		t.nome = Transacao3;		
		simulador.t3.push(t);
		commitAbortEventT3();
		$('#H3').html($('#H3').html() + " -> " + "abort");
	});

	$('#abortT4').on('click',function(){
		var t = new Transacao();
		t.abort = true;
		t.nome = Transacao4;
		simulador.t4.push(t);
		commitAbortEventT4();
		$('#H4').html($('#H4').html() + " -> " + "abort");
	});

	$('#historia1').on('click',function(){
		var tr = new Transacao();
		tr.read = true;
		tr.nome = Transacao1;
		tr.dado = "a"
		simulador.t1.push(tr)

		var tw = new Transacao();
		tw.write = true;
		tw.nome = Transacao1;
		tw.dado = "a";
		simulador.t1.push(tw);

		var tr2 = new Transacao();
		tr2.read = true;
		tr2.nome = Transacao2;
		tr2.dado = "b"
		simulador.t2.push(tr2)

		var tw2 = new Transacao();
		tw2.write = true;
		tw2.nome = Transacao2;
		tw2.dado = "b";
		simulador.t2.push(tw2);

		var tc = new Transacao();
		tc.abort = true;
		tc.nome = Transacao1;
		simulador.t1.push(tc)

		var tc2 = new Transacao();
		tc2.commit = true;
		tc2.nome = Transacao2;
		simulador.t2.push(tc2)

		simulador.dados = [];
		var d = new Dado();
	    	d.dado = "a"
	    	simulador.dados.push(d);

	    var d2 = new Dado();
	    	d2.dado = "b"
	    	simulador.dados.push(d2);
	})

	$('#historia2').on('click',function(){
		var tr = new Transacao();
		tr.read = true;
		tr.nome = Transacao1;
		tr.dado = "a"
		simulador.t1.push(tr)

		var tw = new Transacao();
		tw.write = true;
		tw.nome = Transacao1;
		tw.dado = "b";
		simulador.t1.push(tw);

		var tw2 = new Transacao();
		tw2.write = true;
		tw2.nome = Transacao2;
		tw2.dado = "a";
		simulador.t2.push(tw2);

		var tr2 = new Transacao();
		tr2.read = true;
		tr2.nome = Transacao2;
		tr2.dado = "b"
		simulador.t2.push(tr2)

		var tc = new Transacao();
		tc.commit = true;
		tc.nome = Transacao1;
		simulador.t1.push(tc)

		var tc2 = new Transacao();
		tc2.commit = true;
		tc2.nome = Transacao1;
		simulador.t2.push(tc2)
		
		simulador.dados = [];
		var d = new Dado();
	    	d.dado = "a"
	    	simulador.dados.push(d);

	    var d2 = new Dado();
	    	d2.dado = "b"
	    	simulador.dados.push(d2);
	})

	var btnIniciar = function(){ $('#btnIniciar').on('click',function(){
		createHistory();
		addBlocks();
		mostraHI();
	})};


	var readEventT1 = function(){ $("#T1R").on('change',function(){
		var t1 = new Transacao();
		t1.dado = $("#T1R").val();
		t1.read = true;
		t1.nome = Transacao1;

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
		t1.nome = Transacao1;

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
		t2.nome = Transacao2;

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
		t2.nome = Transacao2;

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
		t3.nome = Transacao3;

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
		t3.nome = Transacao3;

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
		t4.nome = Transacao4;

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
		t4.nome = Transacao4;

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
			$( "#titulo" ).removeClass( "esconder" )	
			$( "#tPadrao" ).removeClass( "esconder" )	
			$( "#hfDiv" ).removeClass( "esconder" )	
		}
		else if($('#rdb2').is(':checked')){
			$( "#T1" ).removeClass( "esconder" );
			$( "#T2" ).removeClass( "esconder" )
			$( "#T3" ).removeClass( "esconder" )
			$( "#titulo" ).removeClass( "esconder" )	
			$( "#tPadrao" ).removeClass( "esconder" )	
			$( "#hfDiv" ).removeClass( "esconder" )	

		}
		else if($('#rdb3').is(':checked')){
			$( "#T1" ).removeClass( "esconder" );
			$( "#T2" ).removeClass( "esconder" )
			$( "#T3" ).removeClass( "esconder" )
			$( "#T4" ).removeClass( "esconder" )
			$( "#titulo" ).removeClass( "esconder" )	
			$( "#tPadrao" ).removeClass( "esconder" )	
			$( "#hfDiv" ).removeClass( "esconder" )	
		}
	}

	function mostraHI(){
		var div = "";
		for(var i = 0; i < historia.HI.length; i++)
		{
			if(historia.HI[i].nome == "T1" && historia.HI[i].read)
				div+= "r1(" + historia.HI[i].dado + ") - ";
			else if(historia.HI[i].nome == "T1" && historia.HI[i].write)
				div+= "w1(" + historia.HI[i].dado + ") - ";
			else if(historia.HI[i].nome == "T1" && historia.HI[i].commit)
				div+= "c1 - ";
			else if(historia.HI[i].nome == "T1" && historia.HI[i].abort)
				div+= "a1 - ";

			else if(historia.HI[i].nome == "T2" && historia.HI[i].read)
				div+= "r2(" + historia.HI[i].dado + ") - ";
			else if(historia.HI[i].nome == "T2" && historia.HI[i].write)
				div+= "w2(" + historia.HI[i].dado + ") - ";
			else if(historia.HI[i].nome == "T2" && historia.HI[i].commit)
				div+= "c2 - ";
			else if(historia.HI[i].nome == "T2" && historia.HI[i].abort)
				div+= "a2 - ";

			else if(historia.HI[i].nome == "T3" && historia.HI[i].read)
				div+= "r3(" + historia.HI[i].dado + ") - ";
			else if(historia.HI[i].nome == "T3" && historia.HI[i].write)
				div+= "w3(" + historia.HI[i].dado + ") - ";
			else if(historia.HI[i].nome == "T3" && historia.HI[i].commit)
				div+= "c3 - ";
			else if(historia.HI[i].nome == "T3" && historia.HI[i].abort)
				div+= "a3 - ";

			else if(historia.HI[i].nome == "T4" && historia.HI[i].read)
				div+= "r4(" + historia.HI[i].dado + ") - ";
			else if(historia.HI[i].nome == "T4" && historia.HI[i].write)
				div+= "w4(" + historia.HI[i].dado + ") - ";
			else if(historia.HI[i].nome == "T4" && historia.HI[i].commit)
				div+= "c4 - ";
			else if(historia.HI[i].nome == "T4" && historia.HI[i].abort)
				div+= "a4 - ";
		}

		$('#hi').html(div);

	}

	function mostraHF(){
		
	}
	