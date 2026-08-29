CC = nvcc
BIN = bin

all: $(BIN)/diag.strsv $(BIN)/lda.strsv $(BIN)/stride.strsv $(BIN)/strsv $(BIN)/trans.strsv $(BIN)/uplo.strsv

$(BIN):
	mkdir -p $(BIN)

$(BIN)/diag.strsv: diag.strsv.c ../../utils/helpers.h | $(BIN)
	$(CC) diag.strsv.c -o $(BIN)/diag.strsv -lcublas

$(BIN)/lda.strsv: lda.strsv.c ../../utils/helpers.h | $(BIN)
	$(CC) lda.strsv.c -o $(BIN)/lda.strsv -lcublas

$(BIN)/stride.strsv: stride.strsv.c ../../utils/helpers.h | $(BIN)
	$(CC) stride.strsv.c -o $(BIN)/stride.strsv -lcublas

$(BIN)/strsv: strsv.c ../../utils/helpers.h | $(BIN)
	$(CC) strsv.c -o $(BIN)/strsv -lcublas

$(BIN)/trans.strsv: trans.strsv.c ../../utils/helpers.h | $(BIN)
	$(CC) trans.strsv.c -o $(BIN)/trans.strsv -lcublas

$(BIN)/uplo.strsv: uplo.strsv.c ../../utils/helpers.h | $(BIN)
	$(CC) uplo.strsv.c -o $(BIN)/uplo.strsv -lcublas

clean:
	rm -rf $(BIN)
