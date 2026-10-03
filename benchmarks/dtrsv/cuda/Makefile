CC = nvcc
BIN = bin

all: $(BIN)/diag.dtrsv $(BIN)/lda.dtrsv $(BIN)/stride.dtrsv $(BIN)/dtrsv $(BIN)/trans.dtrsv $(BIN)/uplo.dtrsv

$(BIN):
	mkdir -p $(BIN)

$(BIN)/diag.dtrsv: diag.dtrsv.c ../../utils/helpers.h | $(BIN)
	$(CC) diag.dtrsv.c -o $(BIN)/diag.dtrsv -lcublas

$(BIN)/lda.dtrsv: lda.dtrsv.c ../../utils/helpers.h | $(BIN)
	$(CC) lda.dtrsv.c -o $(BIN)/lda.dtrsv -lcublas

$(BIN)/stride.dtrsv: stride.dtrsv.c ../../utils/helpers.h | $(BIN)
	$(CC) stride.dtrsv.c -o $(BIN)/stride.dtrsv -lcublas

$(BIN)/dtrsv: dtrsv.c ../../utils/helpers.h | $(BIN)
	$(CC) dtrsv.c -o $(BIN)/dtrsv -lcublas

$(BIN)/trans.dtrsv: trans.dtrsv.c ../../utils/helpers.h | $(BIN)
	$(CC) trans.dtrsv.c -o $(BIN)/trans.dtrsv -lcublas

$(BIN)/uplo.dtrsv: uplo.dtrsv.c ../../utils/helpers.h | $(BIN)
	$(CC) uplo.dtrsv.c -o $(BIN)/uplo.dtrsv -lcublas

clean:
	rm -rf $(BIN)
