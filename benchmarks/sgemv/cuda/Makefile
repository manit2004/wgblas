CC = nvcc
BIN = bin

all: $(BIN)/sgemv $(BIN)/trans.sgemv $(BIN)/stride.sgemv

$(BIN):
	mkdir -p $(BIN)

$(BIN)/sgemv: sgemv.c ../../utils/helpers.h | $(BIN)
	$(CC) sgemv.c -o $(BIN)/sgemv -lcublas

$(BIN)/trans.sgemv: trans.sgemv.c ../../utils/helpers.h | $(BIN)
	$(CC) trans.sgemv.c -o $(BIN)/trans.sgemv -lcublas

$(BIN)/stride.sgemv: stride.sgemv.c ../../utils/helpers.h | $(BIN)
	$(CC) stride.sgemv.c -o $(BIN)/stride.sgemv -lcublas

clean:
	rm -rf $(BIN)
