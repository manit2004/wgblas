CC = nvcc
BIN = bin

all: $(BIN)/strmv $(BIN)/trans.strmv $(BIN)/lda.strmv

$(BIN):
	mkdir -p $(BIN)

$(BIN)/strmv: strmv.c ../../utils/helpers.h | $(BIN)
	$(CC) strmv.c -o $(BIN)/strmv -lcublas

$(BIN)/trans.strmv: trans.strmv.c ../../utils/helpers.h | $(BIN)
	$(CC) trans.strmv.c -o $(BIN)/trans.strmv -lcublas

$(BIN)/lda.strmv: lda.strmv.c ../../utils/helpers.h | $(BIN)
	$(CC) lda.strmv.c -o $(BIN)/lda.strmv -lcublas

clean:
	rm -rf $(BIN)
