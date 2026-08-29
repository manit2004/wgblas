CC = nvcc
BIN = bin

all: $(BIN)/alpha.sgemv $(BIN)/beta.sgemv $(BIN)/lda.sgemv $(BIN)/sgemv $(BIN)/stride.sgemv $(BIN)/trans.sgemv

$(BIN):
	mkdir -p $(BIN)

$(BIN)/alpha.sgemv: alpha.sgemv.c ../../utils/helpers.h | $(BIN)
	$(CC) alpha.sgemv.c -o $(BIN)/alpha.sgemv -lcublas

$(BIN)/beta.sgemv: beta.sgemv.c ../../utils/helpers.h | $(BIN)
	$(CC) beta.sgemv.c -o $(BIN)/beta.sgemv -lcublas

$(BIN)/lda.sgemv: lda.sgemv.c ../../utils/helpers.h | $(BIN)
	$(CC) lda.sgemv.c -o $(BIN)/lda.sgemv -lcublas

$(BIN)/sgemv: sgemv.c ../../utils/helpers.h | $(BIN)
	$(CC) sgemv.c -o $(BIN)/sgemv -lcublas

$(BIN)/stride.sgemv: stride.sgemv.c ../../utils/helpers.h | $(BIN)
	$(CC) stride.sgemv.c -o $(BIN)/stride.sgemv -lcublas

$(BIN)/trans.sgemv: trans.sgemv.c ../../utils/helpers.h | $(BIN)
	$(CC) trans.sgemv.c -o $(BIN)/trans.sgemv -lcublas

clean:
	rm -rf $(BIN)
